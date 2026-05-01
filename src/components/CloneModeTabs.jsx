export default function CloneModeTabs({ mode, onChange }) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
      <button onClick={() => onChange('zero_shot')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'zero_shot' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
        上传声音
      </button>
      <button onClick={() => onChange('reference_id')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'reference_id' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
        精选音色
      </button>
      <button onClick={() => onChange('my_voices')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'my_voices' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
        我的音色
      </button>
    </div>
  );
}
