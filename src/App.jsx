import React, { useState, useEffect, useRef } from 'react';
import { encode } from '@msgpack/msgpack';
import { 
  Key, 
  Upload, 
  Play, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Mic, 
  FileAudio,
  Loader2,
  Trash2,
  Wand2,
  Settings2,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';

export default function App() {
  // === 状态管理 ===
  // API Key 状态
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  
  // ASR API Key 状态 (用于语音识别)
  const [asrApiKey, setAsrApiKey] = useState('');
  const [isAsrKeySaved, setIsAsrKeySaved] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  
  // 表单数据状态
  const [referenceAudio, setReferenceAudio] = useState(null);
  const [referenceText, setReferenceText] = useState('');
  const [targetText, setTargetText] = useState('');

  // 高级功能状态
  const [cloneMode, setCloneMode] = useState('zero_shot'); // 'zero_shot' 或 'reference_id'
  const [referenceId, setReferenceId] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.8);
  const [audioFormat, setAudioFormat] = useState('mp3');
  
  // 应用运行状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioResultUrl, setAudioResultUrl] = useState(null);
  
  const fileInputRef = useRef(null);

  // === 初始化加载 ===
  useEffect(() => {
    // 从本地存储读取保存的 API Key
    const savedKey = localStorage.getItem('fish_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
    }

    const savedAsrKey = localStorage.getItem('asr_api_key');
    if (savedAsrKey) {
      setAsrApiKey(savedAsrKey);
      setIsAsrKeySaved(true);
    }
  }, []);

  // === 事件处理函数 ===
  // 1. 保存/修改 API Key
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setError("请输入有效的 API Key");
      return;
    }
    localStorage.setItem('fish_api_key', apiKey.trim());
    setIsKeySaved(true);
    setError(null);
  };

  const handleClearKey = () => {
    localStorage.removeItem('fish_api_key');
    setApiKey('');
    setIsKeySaved(false);
  };

  const handleSaveAsrKey = () => {
    if (!asrApiKey.trim()) return;
    localStorage.setItem('asr_api_key', asrApiKey.trim());
    setIsAsrKeySaved(true);
  };

  const handleClearAsrKey = () => {
    localStorage.removeItem('asr_api_key');
    setAsrApiKey('');
    setIsAsrKeySaved(false);
  };

  // 2. 处理文件上传
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 限制 5MB
        setError("参考音频文件过大，请上传 5MB 以内的文件");
        return;
      }
      setReferenceAudio(file);
      setError(null);
    }
  };

  // 3. 移除已上传的文件
  const handleRemoveFile = () => {
    setReferenceAudio(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3.5 自动识别参考音频文字 (调用 Whisper API)
  const handleAutoRecognize = async () => {
    if (!referenceAudio) return setError("请先上传参考音频");
    if (!isAsrKeySaved || !asrApiKey) return setError("请在上方配置用于语音识别的 OpenAI API Key");

    setIsRecognizing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", referenceAudio);
      formData.append("model", "whisper-1");

      const response = await fetch("/api/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${asrApiKey.trim()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`识别失败 (HTTP ${response.status})`);
      }

      const data = await response.json();
      setReferenceText(data.text || "");
    } catch (err) {
      console.error(err);
      setError("语音识别失败: " + err.message + "。请检查网络或 API Key 额度。");
    } finally {
      setIsRecognizing(false);
    }
  };

  // 4. 调用 Fish Audio API 进行克隆
  const handleGenerate = async () => {
    // 校验前置条件
    if (!isKeySaved || !apiKey) {
      setError("请先配置并保存 Fish Audio API Key");
      return;
    }

    if (cloneMode === 'zero_shot') {
      if (!referenceAudio) return setError("请上传参考音频");
      if (!referenceText.trim()) return setError("请输入参考音频中对应的文字内容");
    } else {
      if (!referenceId.trim()) return setError("请输入已训练模型的 Reference ID");
    }

    if (!targetText.trim()) {
      setError("请输入需要生成的配音文本");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioResultUrl(null);

    try {
      let bodyData;
      let contentType;

      if (cloneMode === 'zero_shot') {
        // 对于带音频文件的请求，Fish Audio 严格要求使用 application/msgpack
        const arrayBuffer = await referenceAudio.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);

        const payload = {
          text: targetText.trim(),
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
        // 对于仅 reference_id 的请求，使用 JSON 即可
        const payload = {
          text: targetText.trim(),
          format: audioFormat,
          temperature: temperature,
          top_p: topP,
          reference_id: referenceId.trim()
        };
        bodyData = JSON.stringify(payload);
        contentType = 'application/json';
      }

      // 发起请求到代理
      const response = await fetch('/api/fish/v1/tts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': contentType,
        },
        body: bodyData
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (e) {
          // 如果返回的不是 JSON 报错信息
        }
        throw new Error(`API 请求失败: ${errorMsg}`);
      }

      // 成功获取音频流，转换为 Blob 并创建本地 URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioResultUrl(audioUrl);

    } catch (err) {
      console.error(err);
      setError(err.message || "生成失败，请检查网络或 API Key 额度");
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

        {/* 模块 1：API 设置区 */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Key className="w-5 h-5 text-slate-400" />
              API 凭证设置
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Fish Audio 密钥 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Fish Audio API Key (用于声音生成)</label>
                {isKeySaved && <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>已保存</span>}
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    if (isKeySaved) setIsKeySaved(false);
                  }}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {isKeySaved ? (
                  <button onClick={handleClearKey} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">清除/修改</button>
                ) : (
                  <button onClick={handleSaveKey} className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors">保存配置</button>
                )}
              </div>
            </div>

            {/* OpenAI Whisper 密钥 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">OpenAI API Key (可选，用于自动识别台词)</label>
                {isAsrKeySaved && <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>已保存</span>}
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="password"
                  value={asrApiKey}
                  onChange={(e) => {
                    setAsrApiKey(e.target.value);
                    if (isAsrKeySaved) setIsAsrKeySaved(false);
                  }}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx (支持官方或代理源)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {isAsrKeySaved ? (
                  <button onClick={handleClearAsrKey} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">清除/修改</button>
                ) : (
                  <button onClick={handleSaveAsrKey} className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors">保存配置</button>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 mt-4">
            * 您的所有 API Key 仅保存在浏览器本地 localStorage 中，不会上传至任何第三方服务器。
          </p>
        </section>

        {/* 模块 2：克隆工作台 */}
        <section className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-opacity duration-300 ${!isKeySaved ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-slate-400" />
              配音创作面板
            </h2>
            
            {/* 模式切换按钮 */}
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
              <button 
                onClick={() => setCloneMode('zero_shot')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${cloneMode === 'zero_shot' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                实时干声提取
              </button>
              <button 
                onClick={() => setCloneMode('reference_id')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${cloneMode === 'reference_id' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                调用云端模型
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* 动态显示区域 */}
            {cloneMode === 'zero_shot' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-lg border border-slate-100">
                
                {/* 左侧：音频上传 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">1. 上传参考干声 (3-10秒)</label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${referenceAudio ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                  >
                    <input 
                      type="file" 
                      accept="audio/mp3, audio/wav, audio/m4a, audio/ogg" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    
                    {referenceAudio ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 truncate w-full px-4">{referenceAudio.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(referenceAudio.size / 1024).toFixed(1)} KB</p>
                        <button 
                          onClick={handleRemoveFile}
                          className="mt-4 flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> 重新上传
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">点击此处上传音频</p>
                        <p className="text-xs text-slate-400 mt-1">支持 MP3, WAV, M4A 格式</p>
                        <p className="text-xs text-slate-400 mt-1">请确保无背景音乐且吐字清晰</p>
                      </>
                    )}
                  </div>
                </div>

                {/* 右侧：参考文本 */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">2. 参考音频对应的文字</label>
                    <button 
                      onClick={handleAutoRecognize}
                      disabled={isRecognizing || !referenceAudio}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                        isRecognizing ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : 
                        !referenceAudio ? 'text-slate-300' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      {isRecognizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      {isRecognizing ? '识别中...' : '自动提取'}
                    </button>
                  </div>
                  <textarea
                    value={referenceText}
                    onChange={(e) => setReferenceText(e.target.value)}
                    placeholder="可在此手打，或点击右上方「自动提取」通过 AI 识别。包含标点符号能大幅提高克隆准确度..."
                    className="w-full flex-1 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-blue-900 flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  1. 填入您的 Fish Audio 模型 ID (Reference ID)
                </label>
                <p className="text-xs text-blue-700 mb-4 leading-relaxed">
                  如果您在 Fish Audio 官网已经训练了专属音色，或者想使用社区的精选音色，可直接在此处填入模型 ID。<br/>
                  <span className="opacity-75">这样做的好处：无需每次上传音频，且云端精调模型发音更稳定。</span>
                </p>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="例如: 1234567890abcdef1234567890abcdef"
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm"
                />
              </div>
            )}

            {/* 目标文本输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {cloneMode === 'zero_shot' ? '3.' : '2.'} 输入你需要生成的配音台词
              </label>
              <textarea
                value={targetText}
                onChange={(e) => setTargetText(e.target.value)}
                placeholder="在这里输入你想让 AI 念出来的话。支持长文本..."
                className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
              />
            </div>

            {/* 高级参数设置面板 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-slate-500" /> 高级参数控制 (Temperature / Top P / 格式)</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              {showAdvanced && (
                <div className="p-5 space-y-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Temperature */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-slate-700">情感波动程度 (Temperature)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{temperature}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">控制 AI 配音的情绪起伏。值越大，语气越夸张随机；值越小，发音越平稳。</p>
                      <input 
                        type="range" min="0.1" max="1.5" step="0.1" 
                        value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    
                    {/* Top P */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-slate-700">采样清晰度 (Top P)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{topP}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">推荐范围 0.7 - 0.9。越低咬字越清晰死板，越高连读和自然度越好。</p>
                      <input 
                        type="range" min="0.1" max="1.0" step="0.05" 
                        value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* 输出格式 */}
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-slate-700 mb-3">输出音频格式</label>
                    <div className="flex gap-6">
                      {['mp3', 'wav', 'ogg'].map(fmt => (
                        <label key={fmt} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="format" 
                            value={fmt} 
                            checked={audioFormat === fmt}
                            onChange={(e) => setAudioFormat(e.target.value)}
                            className="w-4 h-4 text-blue-600 accent-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                          />
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
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm
                ${isLoading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-lg'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI 正在提取音色并生成配音...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  立即生成克隆配音
                </>
              )}
            </button>
          </div>
        </section>

        {/* 模块 3：结果展示区 */}
        {audioResultUrl && (
          <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              生成成功！
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <audio 
                controls 
                src={audioResultUrl} 
                className="w-full sm:flex-1 h-12 outline-none"
              >
                您的浏览器不支持 audio 标签。
              </audio>
              
              <a
                href={audioResultUrl}
                download={`ai_voice_clone_${Date.now()}.mp3`}
                className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-700 border border-emerald-300 font-medium rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-5 h-5" />
                下载音频
              </a>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}