import { useState } from 'react';
import { Upload, CheckCircle2, Trash2, Loader2, Sparkles, Bookmark } from 'lucide-react';

export default function ZeroShotPanel({
  referenceAudio, fileInputRef, onFileChange, onRemoveFile,
  referenceText, onTextChange, onAutoRecognize, isRecognizing,
  voiceNameInput, onVoiceNameChange, onSaveVoice
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type && !file.type.startsWith('audio/')) {
        return;
      }
      const syntheticEvent = { target: { files: [file] } };
      onFileChange(syntheticEvent);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 上传区域 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">上传音频样本</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!referenceAudio ? handleClickUpload : undefined}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer
              ${referenceAudio
                ? 'border-blue-300 bg-blue-50/50'
                : isDragging
                  ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
          >
            <input type="file" accept="audio/mp3, audio/wav, audio/m4a, audio/ogg" className="hidden" ref={fileInputRef} onChange={onFileChange} />
            {referenceAudio ? (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-slate-700 truncate w-full px-4">{referenceAudio.name}</p>
                <p className="text-xs text-slate-400 mt-1">{(referenceAudio.size / 1024).toFixed(1)} KB</p>
                <button onClick={onRemoveFile} className="mt-4 flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" /> 重新上传
                </button>
              </div>
            ) : isDragging ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-blue-600">松开即可上传</p>
                <p className="text-xs text-slate-400 mt-1">支持拖拽音频文件到此处</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">点击上传或拖拽文件到此处</p>
                <p className="text-xs text-slate-400 mt-1">MP3 / WAV / M4A / OGG，5MB 以内</p>
              </div>
            )}
          </div>
        </div>

        {/* 文字区域 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-600">音频对应的文字</label>
            <button
              onClick={onAutoRecognize}
              disabled={isRecognizing || !referenceAudio}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all
                ${isRecognizing
                  ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                  : !referenceAudio
                    ? 'text-slate-300'
                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                }`}
            >
              {isRecognizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {isRecognizing ? '识别中...' : '自动识别'}
            </button>
          </div>
          <textarea
            value={referenceText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="手动输入或点击自动识别"
            className="input-minimal w-full flex-1 resize-none"
          />
        </div>
      </div>

      {/* 保存音色区域 */}
      {referenceAudio && referenceText && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <Bookmark className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            value={voiceNameInput}
            onChange={e => onVoiceNameChange(e.target.value)}
            placeholder="为这个声音取个名字"
            className="flex-1 px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg
                       text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-100"
          />
          <button onClick={onSaveVoice} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
            收藏音色
          </button>
        </div>
      )}
    </div>
  );
}
