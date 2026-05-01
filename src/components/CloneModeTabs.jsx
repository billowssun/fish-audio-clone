export default function CloneModeTabs({ mode, onChange }) {
  const tabs = [
    { key: 'zero_shot', label: '即时克隆' },
    { key: 'reference_id', label: '官方音色' },
    { key: 'my_voices', label: '我的音色' },
  ];

  return (
    <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all
            ${mode === key
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
