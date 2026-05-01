import { CheckCircle2, Download } from 'lucide-react';

export default function ResultPlayer({ audioUrl, downloadTimestamp, audioFormat }) {
  if (!audioUrl) return null;

  return (
    <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
      <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        生成成功！
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <audio controls src={audioUrl} className="w-full sm:flex-1 h-12 outline-none">
          您的浏览器不支持 audio 标签。
        </audio>

        <a href={audioUrl} download={`ai_voice_clone_${downloadTimestamp}.${audioFormat}`} className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-700 border border-emerald-300 font-medium rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 shrink-0">
          <Download className="w-5 h-5" /> 下载音频
        </a>
      </div>
    </section>
  );
}
