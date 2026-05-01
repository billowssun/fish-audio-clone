import { CheckCircle2, Download } from 'lucide-react';

export default function ResultPlayer({ audioUrl, downloadTimestamp, audioFormat }) {
  if (!audioUrl) return null;

  return (
    <section className="card p-6 border-emerald-200 bg-emerald-50/30">
      <h2 className="text-base font-semibold text-emerald-700 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        生成完成
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <audio controls src={audioUrl} className="w-full sm:flex-1 h-10 rounded-lg">
          你的浏览器不支持 audio 标签。
        </audio>

        <a
          href={audioUrl}
          download={`voicecanvas_${downloadTimestamp}.${audioFormat}`}
          className="w-full sm:w-auto px-5 py-2.5 bg-white text-emerald-700 border border-emerald-200 font-medium rounded-lg
                     hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shrink-0 text-sm"
        >
          <Download className="w-4 h-4" /> 下载
        </a>
      </div>
    </section>
  );
}
