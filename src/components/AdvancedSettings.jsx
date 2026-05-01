import { Settings2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function AdvancedSettings({
  show, onToggle,
  model, onModelChange,
  temperature, onTemperatureChange,
  topP, onTopPChange,
  audioFormat, onFormatChange
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button onClick={onToggle} className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
        <span className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-slate-500" /> 高级参数控制 (模型 / Temperature / Top P)</span>
        {show ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {show && (
        <div className="p-5 space-y-6 border-t border-slate-200">
          <div className="pb-4 border-b border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-3">AI 底模选择 (Base Model)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onModelChange('fishaudio/fish-speech-1')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${model === 'fishaudio/fish-speech-1' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <div className="font-medium text-slate-900 mb-1 flex items-center justify-between">
                  <span>Fish Speech V1 (s1)</span>
                  {model === 'fishaudio/fish-speech-1' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-500">初代经典模型。生成速度较快，适合大部分常规文本的配音任务。</p>
              </div>

              <div
                onClick={() => onModelChange('fishaudio/fish-speech-1.5')}
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
              <input type="range" min="0.1" max="1.5" step="0.1" value={temperature} onChange={(e) => onTemperatureChange(parseFloat(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-700">采样清晰度 (Top P)</label>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{topP}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">推荐范围 0.7 - 0.9。越低咬字越清晰死板，越高连读和自然度越好。</p>
              <input type="range" min="0.1" max="1.0" step="0.05" value={topP} onChange={(e) => onTopPChange(parseFloat(e.target.value))} className="w-full accent-blue-600" />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-3">输出音频格式</label>
            <div className="flex gap-6">
              {['mp3', 'wav', 'ogg'].map(fmt => (
                <label key={fmt} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="format" value={fmt} checked={audioFormat === fmt} onChange={(e) => onFormatChange(e.target.value)} className="w-4 h-4 text-blue-600 accent-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-600 uppercase group-hover:text-slate-900">{fmt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
