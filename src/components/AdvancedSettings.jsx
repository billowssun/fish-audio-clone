import { Settings2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function AdvancedSettings({
  show, onToggle,
  model, onModelChange,
  temperature, onTemperatureChange,
  topP, onTopPChange,
  audioFormat, onFormatChange
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> 声音微调</span>
        {show ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {show && (
        <div className="p-5 space-y-5 border-t border-slate-100">
          {/* 模型选择 */}
          <div className="pb-4 border-b border-slate-100">
            <label className="block text-sm font-medium text-slate-600 mb-3">AI 模型</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => onModelChange('fishaudio/fish-speech-1')}
                className={`p-4 rounded-lg border cursor-pointer transition-all
                  ${model === 'fishaudio/fish-speech-1'
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="font-medium text-slate-800 mb-1 flex items-center justify-between">
                  <span>快速引擎</span>
                  {model === 'fishaudio/fish-speech-1' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-400">处理速度快，适合批量配音和短文本生成。</p>
              </div>

              <div
                onClick={() => onModelChange('fishaudio/fish-speech-1.5')}
                className={`p-4 rounded-lg border cursor-pointer transition-all
                  ${model === 'fishaudio/fish-speech-1.5'
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="font-medium text-slate-800 mb-1 flex items-center justify-between">
                  <span>高保真引擎</span>
                  {model === 'fishaudio/fish-speech-1.5' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-400">情感表现力强，音色还原度高，推荐使用。</p>
              </div>
            </div>
          </div>

          {/* 滑块参数 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-600">情感表现力</label>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{temperature}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">值越高语气越丰富，值越低越平稳。</p>
              <input
                type="range" min="0.1" max="1.5" step="0.1"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-600">发音清晰度</label>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{topP}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">推荐 0.7-0.9，越低越清晰。</p>
              <input
                type="range" min="0.1" max="1.0" step="0.05"
                value={topP}
                onChange={(e) => onTopPChange(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {/* 输出格式 */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-600 mb-2">输出格式</label>
            <div className="flex gap-6">
              {['mp3', 'wav', 'ogg'].map(fmt => (
                <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="format" value={fmt}
                    checked={audioFormat === fmt}
                    onChange={(e) => onFormatChange(e.target.value)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-500 uppercase">{fmt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
