import React, { useState, useEffect, useRef } from 'react';
import { encode } from '@msgpack/msgpack';
import localforage from 'localforage';
import { 
  Key, Upload, Play, Download, AlertCircle, CheckCircle2, Mic, FileAudio,
  Loader2, Trash2, Wand2, Settings2, ChevronDown, ChevronUp, Database,
  Bookmark, Sparkles, User, AudioLines
} from 'lucide-react';

const OFFICIAL_PRESETS = [
  { id: "7f92f8afb8ec43bf81429cc1c9199cb1", name: "清朗男声 (Alex)" },
  { id: "54a5170264694bfc8e9ad98df7bd89c3", name: "温柔女声 (Anna)" },
  { id: "10287134800249fb92160d5b248a0429", name: "成熟男声 (Benjamin)" },
  { id: "d7f82dcbd8a5436696d7411bbd62e76a", name: "甜美女声 (Claire)" },
];

export default function App() {
  // 表单数据状态
  const [referenceAudio, setReferenceAudio] = useState(null);
  const [referenceText, setReferenceText] = useState('');
  const [targetText, setTargetText] = useState('');

  // 模式与预设状态
  const [cloneMode, setCloneMode] = useState('zero_shot'); // 'zero_shot', 'reference_id', 'my_voices'
  const [referenceId, setReferenceId] = useState('');
  const [savedVoices, setSavedVoices] = useState([]);
  const [voiceNameInput, setVoiceNameInput] = useState('');

  // 语音识别状态
  const [isRecognizing, setIsRecognizing] = useState(false);

  // 高级功能状态
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [model, setModel] = useState('fishaudio/fish-speech-1.5');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.8);
  const [audioFormat, setAudioFormat] = useState('mp3');
  
  // 应用运行状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioResultUrl, setAudioResultUrl] = useState(null);
  
  const fileInputRef = useRef(null);

  // 初始化加载本地保存的音色
  useEffect(() => {
    loadSavedVoices();
  }, []);

  const loadSavedVoices = async () => {
    try {
      const voices = await localforage.getItem('my_saved_voices') || [];
      setSavedVoices(voices);
    } catch (err) {
      console.error("加载本地音色失败:", err);
    }
  };

  // 处理文件上传
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("参考音频文件过大，请上传 5MB 以内的文件");
        return;
      }
      setReferenceAudio(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setReferenceAudio(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 自动识别参考音频文字 (调用自建阿里云代理)
  const handleAutoRecognize = async () => {
    if (!referenceAudio) return setError("请先上传参考音频");

    setIsRecognizing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", referenceAudio);
      formData.append("model", "sensevoice-v1"); // 阿里云模型标识

      const response = await fetch("/api/aliyun/asr", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error(`识别失败 (HTTP ${response.status})`);

      const data = await response.json();
      setReferenceText(data.text || "");
    } catch (err) {
      console.error(err);
      setError("语音识别失败: " + err.message);
    } finally {
      setIsRecognizing(false);
    }
  };

  // 保存音色到本地 IndexedDB
  const handleSaveVoice = async () => {
    if (!referenceAudio || !referenceText.trim()) {
      return setError("必须包含音频和对应文本才能保存！");
    }
    if (!voiceNameInput.trim()) {
      return setError("请输入音色名称！");
    }

    try {
      const arrayBuffer = await referenceAudio.arrayBuffer();
      const newVoice = {
        id: Date.now().toString(),
        name: voiceNameInput.trim(),
        audioData: arrayBuffer,
        audioName: referenceAudio.name,
        audioMime: referenceAudio.type,
        text: referenceText.trim(),
        timestamp: new Date().toISOString()
      };

      const currentVoices = await localforage.getItem('my_saved_voices') || [];
      const updatedVoices = [newVoice, ...currentVoices];
      await localforage.setItem('my_saved_voices', updatedVoices);
      
      setSavedVoices(updatedVoices);
      setVoiceNameInput('');
      alert("音色已保存到您的私人音色库！");
    } catch (err) {
      console.error(err);
      setError("保存音色失败：" + err.message);
    }
  };

  const handleDeleteVoice = async (id) => {
    if (!confirm("确定要删除这个音色吗？")) return;
    try {
      const updatedVoices = savedVoices.filter(v => v.id !== id);
      await localforage.setItem('my_saved_voices', updatedVoices);
      setSavedVoices(updatedVoices);
    } catch (err) {
      console.error("删除失败:", err);
    }
  };

  const applySavedVoice = (voice) => {
    const blob = new Blob([voice.audioData], { type: voice.audioMime });
    const file = new File([blob], voice.audioName, { type: voice.audioMime });
    setReferenceAudio(file);
    setReferenceText(voice.text);
    setCloneMode('zero_shot');
  };

  // 调用 Fish Audio API 进行克隆
  const handleGenerate = async () => {
    if (cloneMode === 'zero_shot') {
      if (!referenceAudio) return setError("请上传参考音频");
      if (!referenceText.trim()) return setError("请输入参考音频中对应的文字内容");
    } else if (cloneMode === 'reference_id') {
      if (!referenceId.trim()) return setError("请选择或输入已训练模型的 Reference ID");
    }

    if (!targetText.trim()) return setError("请输入需要生成的配音文本");

    setIsLoading(true);
    setError(null);
    setAudioResultUrl(null);

    try {
      let bodyData;
      let contentType;

      if (cloneMode === 'zero_shot') {
        const arrayBuffer = await referenceAudio.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);

        const payload = {
          text: targetText.trim(),
          model: model,
          format: audioFormat,
          temperature: temperature,
          top_p: topP,
          references: [
            {
              audio: audioBytes,
              text: referenceText.trim()
            }
          ]
        };
        bodyData = encode(payload);
        contentType = 'application/msgpack';
      } else {
        const payload = {
          text: targetText.trim(),
          model: model,
          format: audioFormat,
          temperature: temperature,
          top_p: topP,
          reference_id: referenceId.trim()
        };
        bodyData = JSON.stringify(payload);
        contentType = 'application/json';
      }

      // 所有 API 凭证均在 Vercel 代理端注入
      const response = await fetch('/api/fish/v1/tts', {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: bodyData
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (e) {}
        throw new Error(`API 请求失败: ${errorMsg}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioResultUrl(audioUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || "生成失败，请检查网络或后端配置");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 头部标题区 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Mic className="w-8 h-8 text-blue-600" />
            AI 声音克隆工作台 <span className="text-sm font-normal bg-blue-100 text-blue-700 py-1 px-2 rounded-md ml-2">Pro 版</span>
          </h1>
          <p className="text-slate-500 mt-2">基于 Fish Audio 零样本克隆技术，极客专属配音工具。</p>
        </header>

        {/* 错误提示框 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* 模块：克隆工作台 */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-slate-400" />
              配音创作面板
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
              <button onClick={() => setCloneMode('zero_shot')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${cloneMode === 'zero_shot' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                实时提取干声
              </button>
              <button onClick={() => setCloneMode('reference_id')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${cloneMode === 'reference_id' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                官方/预设云端模型
              </button>
              <button onClick={() => setCloneMode('my_voices')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${cloneMode === 'my_voices' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                私人音色库
              </button>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 模式：实时提取干声 */}
            {cloneMode === 'zero_shot' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">1. 上传参考干声 (3-10秒)</label>
                    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${referenceAudio ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                      <input type="file" accept="audio/mp3, audio/wav, audio/m4a, audio/ogg" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                      {referenceAudio ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-700 truncate w-full px-4">{referenceAudio.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{(referenceAudio.size / 1024).toFixed(1)} KB</p>
                          <button onClick={handleRemoveFile} className="mt-4 flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" /> 重新上传
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-sm text-slate-600 font-medium">点击此处上传音频</p>
                          <p className="text-xs text-slate-400 mt-1">支持 MP3, WAV 等，请确保吐字清晰无背景音</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">2. 音频对应文字</label>
                      <button onClick={handleAutoRecognize} disabled={isRecognizing || !referenceAudio} className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${isRecognizing ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : !referenceAudio ? 'text-slate-300' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                        {isRecognizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        {isRecognizing ? '识别中...' : '自动提取 (阿里云)'}
                      </button>
                    </div>
                    <textarea value={referenceText} onChange={(e) => setReferenceText(e.target.value)} placeholder="可手动输入，或点击自动提取..." className="w-full flex-1 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>

                {/* 保存音色快捷功能 */}
                {referenceAudio && referenceText && (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <Bookmark className="w-5 h-5 text-amber-500 shrink-0" />
                    <input type="text" value={voiceNameInput} onChange={e => setVoiceNameInput(e.target.value)} placeholder="给这个声音起个名字..." className="flex-1 px-3 py-1.5 text-sm border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white" />
                    <button onClick={handleSaveVoice} className="px-4 py-1.5 bg-amber-500 text-white text-sm font-medium rounded hover:bg-amber-600 transition-colors whitespace-nowrap">
                      保存到私人库
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 模式：官方/预设云端模型 */}
            {cloneMode === 'reference_id' && (
              <div className="space-y-4">
                <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <label className="block text-sm font-medium text-blue-900 flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    选择官方预设音色
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {OFFICIAL_PRESETS.map(preset => (
                      <button 
                        key={preset.id}
                        onClick={() => setReferenceId(preset.id)}
                        className={`p-3 text-sm font-medium rounded-lg border transition-all text-left ${referenceId === preset.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>

                  <label className="block text-sm font-medium text-blue-900 flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    或输入自定义模型 ID (Reference ID)
                  </label>
                  <input type="text" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="例如: 1234567890abcdef1234567890abcdef" className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm" />
                </div>
              </div>
            )}

            {/* 模式：私人音色库 */}
            {cloneMode === 'my_voices' && (
              <div className="space-y-4">
                <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 min-h-[200px]">
                  <label className="block text-sm font-medium text-emerald-900 flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-emerald-600" />
                    我的私人音色库 (本地安全存储)
                  </label>
                  
                  {savedVoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-emerald-600/60">
                      <AudioLines className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">暂无保存的音色，去「实时提取干声」保存一个吧！</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedVoices.map(voice => (
                        <div key={voice.id} className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm flex flex-col justify-between group">
                          <div>
                            <h3 className="font-medium text-emerald-900 mb-1">{voice.name}</h3>
                            <p className="text-xs text-slate-500 truncate mb-3" title={voice.text}>"{voice.text}"</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-50">
                            <button onClick={() => applySavedVoice(voice)} className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                              使用此音色
                            </button>
                            <button onClick={() => handleDeleteVoice(voice.id)} className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 目标文本输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                输入需要生成的配音台词
              </label>
              <textarea value={targetText} onChange={(e) => setTargetText(e.target.value)} placeholder="在这里输入你想让 AI 念出来的话。支持长文本..." className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed" />
            </div>

            {/* 高级参数设置面板 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                <span className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-slate-500" /> 高级参数控制 (模型 / Temperature / Top P)</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              {showAdvanced && (
                <div className="p-5 space-y-6 border-t border-slate-200">
                  {/* 底模选择 */}
                  <div className="pb-4 border-b border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-3">AI 底模选择 (Base Model)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setModel('fishaudio/fish-speech-1')}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${model === 'fishaudio/fish-speech-1' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <div className="font-medium text-slate-900 mb-1 flex items-center justify-between">
                          <span>Fish Speech V1 (s1)</span>
                          {model === 'fishaudio/fish-speech-1' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-500">初代经典模型。生成速度较快，适合大部分常规文本的配音任务。</p>
                      </div>
                      
                      <div 
                        onClick={() => setModel('fishaudio/fish-speech-1.5')}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${model === 'fishaudio/fish-speech-1.5' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <div className="font-medium text-slate-900 mb-1 flex items-center justify-between">
                          <span>Fish Speech V1.5 (s2 Pro)</span>
                          {model === 'fishaudio/fish-speech-1.5' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-500">全新架构升级。情感表现力更强，咬字更清晰，音色克隆还原度极高。</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-slate-700">情感波动程度 (Temperature)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{temperature}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">控制 AI 配音的情绪起伏。值越大，语气越夸张随机；值越小，发音越平稳。</p>
                      <input type="range" min="0.1" max="1.5" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-slate-700">采样清晰度 (Top P)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{topP}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">推荐范围 0.7 - 0.9。越低咬字越清晰死板，越高连读和自然度越好。</p>
                      <input type="range" min="0.1" max="1.0" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-sm font-medium text-slate-700 mb-3">输出音频格式</label>
                    <div className="flex gap-6">
                      {['mp3', 'wav', 'ogg'].map(fmt => (
                        <label key={fmt} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="format" value={fmt} checked={audioFormat === fmt} onChange={(e) => setAudioFormat(e.target.value)} className="w-4 h-4 text-blue-600 accent-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500" />
                          <span className="text-sm font-medium text-slate-600 uppercase group-hover:text-slate-900">{fmt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || cloneMode === 'my_voices'}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm
                ${isLoading || cloneMode === 'my_voices'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-lg'
                }`}
            >
              {isLoading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> AI 正在提取音色并生成配音...</>
              ) : cloneMode === 'my_voices' ? (
                "请先从上方选择一个音色使用"
              ) : (
                <><Play className="w-6 h-6" /> 立即生成克隆配音</>
              )}
            </button>
          </div>
        </section>

        {/* 结果展示区 */}
        {audioResultUrl && (
          <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              生成成功！
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <audio controls src={audioResultUrl} className="w-full sm:flex-1 h-12 outline-none">
                您的浏览器不支持 audio 标签。
              </audio>
              
              <a href={audioResultUrl} download={`ai_voice_clone_${Date.now()}.mp3`} className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-700 border border-emerald-300 font-medium rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 shrink-0">
                <Download className="w-5 h-5" /> 下载音频
              </a>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}