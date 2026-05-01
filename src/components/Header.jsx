export default function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">VoiceCanvas</h1>
          <p className="text-xs text-slate-400 tracking-wide">AI 声音克隆</p>
        </div>
      </div>
      <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
        上传一段清晰音频，AI 精准学习你的声音特征，用你的声音表达任何文字。
      </p>
    </header>
  );
}
