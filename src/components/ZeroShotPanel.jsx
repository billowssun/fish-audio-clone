import { Upload, CheckCircle2, Trash2, Loader2, Wand2, Bookmark } from 'lucide-react';

export default function ZeroShotPanel({
  referenceAudio, fileInputRef, onFileChange, onRemoveFile,
  referenceText, onTextChange, onAutoRecognize, isRecognizing,
  voiceNameInput, onVoiceNameChange, onSaveVoice
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-lg border border-slate-100">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">1. 上传参考干声 (3-10秒)</label>
          <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${referenceAudio ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
            <input type="file" accept="audio/mp3, audio/wav, audio/m4a, audio/ogg" className="hidden" ref={fileInputRef} onChange={onFileChange} />
            {referenceAudio ? (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700 truncate w-full px-4">{referenceAudio.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(referenceAudio.size / 1024).toFixed(1)} KB</p>
                <button onClick={onRemoveFile} className="mt-4 flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
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
            <button onClick={onAutoRecognize} disabled={isRecognizing || !referenceAudio} className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${isRecognizing ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : !referenceAudio ? 'text-slate-300' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
              {isRecognizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              {isRecognizing ? '识别中...' : '智能识别'}
            </button>
          </div>
          <textarea value={referenceText} onChange={(e) => onTextChange(e.target.value)} placeholder="可手动输入，或点击自动提取..." className="w-full flex-1 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
      </div>

      {referenceAudio && referenceText && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
          <Bookmark className="w-5 h-5 text-amber-500 shrink-0" />
          <input type="text" value={voiceNameInput} onChange={e => onVoiceNameChange(e.target.value)} placeholder="给这个声音起个名字..." className="flex-1 px-3 py-1.5 text-sm border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white" />
          <button onClick={onSaveVoice} className="px-4 py-1.5 bg-amber-500 text-white text-sm font-medium rounded hover:bg-amber-600 transition-colors whitespace-nowrap">
            保存到私人库
          </button>
        </div>
      )}
    </div>
  );
}
