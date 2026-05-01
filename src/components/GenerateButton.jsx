import { Loader2, Play } from 'lucide-react';

export default function GenerateButton({ isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm
        ${isLoading
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-lg'
        }`}
    >
      {isLoading ? (
        <><Loader2 className="w-6 h-6 animate-spin" /> AI 正在提取音色并生成配音...</>
      ) : (
        <><Play className="w-6 h-6" /> 立即生成克隆配音</>
      )}
    </button>
  );
}
