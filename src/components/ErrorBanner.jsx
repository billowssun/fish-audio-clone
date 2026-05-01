import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <p className="text-red-600 text-sm leading-relaxed">{message}</p>
    </div>
  );
}
