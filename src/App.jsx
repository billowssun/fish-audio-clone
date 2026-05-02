import React, { useState, useEffect, useRef } from 'react';
import { FileAudio } from 'lucide-react';
import Header from './components/Header';
import ErrorBanner from './components/ErrorBanner';
import CloneModeTabs from './components/CloneModeTabs';
import ZeroShotPanel from './components/ZeroShotPanel';
import ReferenceIdPanel from './components/ReferenceIdPanel';
import MyVoicesPanel from './components/MyVoicesPanel';
import TargetTextInput from './components/TargetTextInput';
import AdvancedSettings from './components/AdvancedSettings';
import GenerateButton from './components/GenerateButton';
import ResultPlayer from './components/ResultPlayer';
import ErrorBoundary from './components/ErrorBoundary';
import GenerationHistory from './components/GenerationHistory';
import useLocalVoices from './hooks/useLocalVoices';
import useTTS from './hooks/useTTS';

export default function App() {
  const [referenceAudio, setReferenceAudio] = useState(null);
  const [referenceText, setReferenceText] = useState('');
  const [targetText, setTargetText] = useState('');

  const [cloneMode, setCloneMode] = useState('zero_shot');
  const [referenceId, setReferenceId] = useState('');
  const [voiceNameInput, setVoiceNameInput] = useState('');

  const [isRecognizing, setIsRecognizing] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [model, setModel] = useState('fishaudio/fish-speech-1.5');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.8);
  const [audioFormat, setAudioFormat] = useState('mp3');

  const [error, setError] = useState(null);
  const [audioResultUrl, setAudioResultUrl] = useState(null);
  const [downloadTimestamp, setDownloadTimestamp] = useState(null);
  const [generationHistory, setGenerationHistory] = useState([]);

  const fileInputRef = useRef(null);
  const historyUrlsRef = useRef([]);
  const { savedVoices, saveVoice: persistVoice, deleteVoice: removeVoice } = useLocalVoices();
  const { generate, isLoading } = useTTS();

  useEffect(() => {
    return () => {
      if (audioResultUrl) URL.revokeObjectURL(audioResultUrl);
    };
  }, [audioResultUrl]);

  useEffect(() => {
    return () => {
      historyUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("音频文件过大，请上传 5MB 以内的文件");
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

  const handleAutoRecognize = async () => {
    if (!referenceAudio) return setError("请先上传音频");

    setIsRecognizing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", referenceAudio);
      formData.append("prompt", "以下是一段中文语音，请完整转录并添加正确的标点符号。");

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

  const handleSaveVoice = async () => {
    try {
      await persistVoice({
        referenceAudio,
        referenceText,
        voiceName: voiceNameInput
      });
      setVoiceNameInput('');
      alert("音色已保存到你的私人音色库！");
    } catch (err) {
      console.error(err);
      setError("保存音色失败：" + err.message);
    }
  };

  const handleDeleteVoice = async (id) => {
    if (!confirm("确定要删除这个音色吗？")) return;
    try {
      await removeVoice(id);
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

  const handleGenerate = async () => {
    setError(null);
    setAudioResultUrl(null);

    try {
      const audioBlob = await generate({
        cloneMode,
        referenceAudio,
        referenceText,
        referenceId,
        targetText,
        model,
        audioFormat,
        temperature,
        topP
      });

      const timestamp = Date.now();
      const audioUrl = URL.createObjectURL(audioBlob);
      const historyAudioUrl = URL.createObjectURL(audioBlob);
      historyUrlsRef.current.push(historyAudioUrl);

      setAudioResultUrl(audioUrl);
      setDownloadTimestamp(timestamp);
      setGenerationHistory(prev => [
        {
          id: `${timestamp}-${prev.length}`,
          audioUrl: historyAudioUrl,
          format: audioFormat,
          text: targetText.trim(),
          timestamp,
        },
        ...prev,
      ].slice(0, 6));
    } catch (err) {
      console.error(err);
      setError(err.message || "生成失败，请检查网络或后端配置");
    }
  };

  const handleClearHistory = () => {
    historyUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    historyUrlsRef.current = [];
    setGenerationHistory([]);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <Header />
          <ErrorBanner message={error} />

          <section className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-blue-500" />
                配音创作
              </h2>
              <CloneModeTabs mode={cloneMode} onChange={setCloneMode} />
            </div>

            <div className="space-y-5">
              {cloneMode === 'zero_shot' && (
                <ZeroShotPanel
                  referenceAudio={referenceAudio}
                  fileInputRef={fileInputRef}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                  referenceText={referenceText}
                  onTextChange={setReferenceText}
                  onAutoRecognize={handleAutoRecognize}
                  isRecognizing={isRecognizing}
                  voiceNameInput={voiceNameInput}
                  onVoiceNameChange={setVoiceNameInput}
                  onSaveVoice={handleSaveVoice}
                />
              )}

              {cloneMode === 'reference_id' && (
                <ReferenceIdPanel referenceId={referenceId} onChange={setReferenceId} />
              )}

              {cloneMode === 'my_voices' && (
                <MyVoicesPanel
                  voices={savedVoices}
                  onApply={applySavedVoice}
                  onDelete={handleDeleteVoice}
                />
              )}

              <TargetTextInput value={targetText} onChange={setTargetText} />

              <AdvancedSettings
                show={showAdvanced}
                onToggle={() => setShowAdvanced(!showAdvanced)}
                model={model}
                onModelChange={setModel}
                temperature={temperature}
                onTemperatureChange={setTemperature}
                topP={topP}
                onTopPChange={setTopP}
                audioFormat={audioFormat}
                onFormatChange={setAudioFormat}
              />

              <GenerateButton isLoading={isLoading} onClick={handleGenerate} />
            </div>
          </section>

          <ResultPlayer
            audioUrl={audioResultUrl}
            downloadTimestamp={downloadTimestamp}
            audioFormat={audioFormat}
          />

          <GenerationHistory
            items={generationHistory}
            onReuseText={setTargetText}
            onClear={handleClearHistory}
          />

        </div>
      </div>
    </ErrorBoundary>
  );
}
