import { Mic } from 'lucide-react';

export default function Header() {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
        <Mic className="w-8 h-8 text-blue-600" />
        AI 声音克隆工作台 <span className="text-sm font-normal bg-blue-100 text-blue-700 py-1 px-2 rounded-md ml-2">Pro 版</span>
      </h1>
      <p className="text-slate-500 mt-2">基于 Fish Audio 零样本克隆技术，让您的声音跨越时间与空间，赋予文字以生命。</p>
    </header>
  );
}
