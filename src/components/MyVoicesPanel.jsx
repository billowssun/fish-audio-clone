import { User, AudioLines } from 'lucide-react';

export default function MyVoicesPanel({ voices, onApply, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="p-5 bg-emerald-50/30 rounded-xl border border-emerald-100/50 min-h-[180px]">
        <label className="block text-sm font-medium text-slate-700 flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-emerald-500" />
          我的私人音色库
        </label>

        {voices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-slate-300">
            <AudioLines className="w-8 h-8 mb-2" />
            <p className="text-sm">还没有保存的音色，去录制一段专属声音吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voices.map(voice => (
              <div key={voice.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between group hover:border-emerald-200 transition-all">
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">{voice.name}</h3>
                  <p className="text-xs text-slate-400 truncate mb-3" title={voice.text}>"{voice.text}"</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <button onClick={() => onApply(voice)} className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                    使用此音色
                  </button>
                  <button onClick={() => onDelete(voice.id)} className="text-xs text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
