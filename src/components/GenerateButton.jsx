import { Loader2, Play } from 'lucide-react';

export default function GenerateButton({ isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="btn-primary flex items-center justify-center gap-2.5 text-base"
    >
      {isLoading ? (
        <><Loader2 className="w-5 h-5 animate-spin" /> AI 正在生成专属声音...</>
      ) : (
        <><Play className="w-5 h-5" /> 开始生成</>
      )}
    </button>
  );
}
