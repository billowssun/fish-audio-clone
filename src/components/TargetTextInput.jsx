export default function TargetTextInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">
        想让 AI 说什么？
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入需要配音的文字内容..."
        className="input-minimal w-full h-36 resize-none leading-relaxed"
      />
    </div>
  );
}
