import { User, AudioLines } from 'lucide-react';

export default function MyVoicesPanel({ voices, onApply, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 min-h-[200px]">
        <label className="block text-sm font-medium text-emerald-900 flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-emerald-600" />
          我的私人音色库 (本地安全存储)
        </label>

        {voices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-emerald-600/60">
            <AudioLines className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">暂无保存的音色，去「上传声音」保存一个吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {voices.map(voice => (
              <div key={voice.id} className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm flex flex-col justify-between group">
                <div>
                  <h3 className="font-medium text-emerald-900 mb-1">{voice.name}</h3>
                  <p className="text-xs text-slate-500 truncate mb-3" title={voice.text}>"{voice.text}"</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-50">
                  <button onClick={() => onApply(voice)} className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    使用此音色
                  </button>
                  <button onClick={() => onDelete(voice.id)} className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
