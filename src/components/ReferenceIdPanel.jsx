import { Sparkles, Database } from 'lucide-react';

const OFFICIAL_PRESETS = [
  { id: "7f92f8afb8ec43bf81429cc1c9199cb1", name: "清朗男声 (Alex)" },
  { id: "54a5170264694bfc8e9ad98df7bd89c3", name: "温柔女声 (Anna)" },
  { id: "10287134800249fb92160d5b248a0429", name: "成熟男声 (Benjamin)" },
  { id: "d7f82dcbd8a5436696d7411bbd62e76a", name: "甜美女声 (Claire)" },
];

export default function ReferenceIdPanel({ referenceId, onChange }) {
  return (
    <div className="space-y-4">
      <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
        <label className="block text-sm font-medium text-blue-900 flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          选择官方预设音色
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {OFFICIAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onChange(preset.id)}
              className={`p-3 text-sm font-medium rounded-lg border transition-all text-left ${referenceId === preset.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium text-blue-900 flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-blue-600" />
          或输入自定义模型 ID (Reference ID)
        </label>
        <input type="text" value={referenceId} onChange={(e) => onChange(e.target.value)} placeholder="例如: 1234567890abcdef1234567890abcdef" className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm" />
      </div>
    </div>
  );
}
