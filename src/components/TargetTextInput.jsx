export default function TargetTextInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        输入需要生成的配音台词
      </label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="在这里输入你想让 AI 念出来的话。支持长文本..." className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed" />
    </div>
  );
}
