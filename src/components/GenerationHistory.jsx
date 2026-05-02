import { Clock3, Download, RotateCcw, Trash2 } from 'lucide-react';

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

export default function GenerationHistory({ items, onReuseText, onClear }) {
  if (items.length === 0) return null;

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-blue-500" />
          本次生成记录
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          清空
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border border-slate-200 rounded-xl p-3 bg-white">
            <div className="flex flex-col md:flex-row md:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">{formatTime(item.timestamp)}</span>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                    {item.format}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.text}</p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:w-48">
                <audio controls src={item.audioUrl} className="w-full h-9" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onReuseText(item.text)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-2 py-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    复用文本
                  </button>
                  <a
                    href={item.audioUrl}
                    download={`voicecanvas_${item.timestamp}.${item.format}`}
                    className="inline-flex items-center justify-center text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg px-2 py-1.5 transition-colors"
                    title="下载"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
