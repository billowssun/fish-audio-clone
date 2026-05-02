import { useEffect, useState, useRef } from 'react';
import { BookOpen, Briefcase, Database, Film, Gamepad2, Heart, Play, Pause, ChevronDown, Sparkles, Users } from 'lucide-react';
import VoiceExplorer from './VoiceExplorer';
import { proxyAudioUrl } from '../utils/proxy';
import { CATEGORIES, VOICE_PRESETS } from '../data/voicePresets';

const INITIAL_COUNT = 6;

const CATEGORY_ICONS = {
  bookOpen: BookOpen,
  briefcase: Briefcase,
  film: Film,
  gamepad: Gamepad2,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
};

export default function ReferenceIdPanel({ referenceId, onChange }) {
  const [activeCategory, setActiveCategory] = useState('featured');
  const [expanded, setExpanded] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const voices = VOICE_PRESETS[activeCategory];
  const visibleVoices = expanded ? voices : voices.slice(0, INITIAL_COUNT);
  const hasMore = voices.length > INITIAL_COUNT;

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      audio.src = '';
    };
  }, []);

  const handlePreview = (voiceId, sampleUrl) => {
    if (!sampleUrl) return;

    if (playingId === voiceId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }

    const audio = new Audio(proxyAudioUrl(sampleUrl));
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    setPlayingId(voiceId);
  };

  return (
    <div className="space-y-4">
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(({ key, label, icon }) => {
          const Icon = CATEGORY_ICONS[icon] || Sparkles;
          return (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setExpanded(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all
                ${activeCategory === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          );
        })}
      </div>

      {/* 闊宠壊鍗＄墖缃戞牸 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleVoices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onChange(voice.id)}
            className={`p-4 rounded-xl border transition-all text-left group relative
              ${referenceId === voice.id
                ? 'bg-blue-50 border-blue-300 shadow-sm'
                : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'
              }`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <span className={`font-medium text-sm ${referenceId === voice.id ? 'text-blue-700' : 'text-slate-800'}`}>
                {voice.name}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {voice.sampleUrl && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handlePreview(voice.id, voice.sampleUrl); }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                      ${playingId === voice.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    title={playingId === voice.id ? '暂停' : '试听'}
                  >
                    {playingId === voice.id
                      ? <Pause className="w-3 h-3" />
                      : <Play className="w-3 h-3 ml-0.5" />
                    }
                  </span>
                )}
                {referenceId === voice.id && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-0.5" />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">{voice.desc}</p>
            <div className="flex gap-1 flex-wrap">
              {voice.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-500">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* 展开更多 */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all"
        >
          {expanded ? '收起' : `展开更多音色 (+${voices.length - INITIAL_COUNT})`}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* 自定义输入 */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <label className="block text-sm font-medium text-slate-600 flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-blue-500" />
          或粘贴自定义 Reference ID
        </label>
        <input
          type="text"
          value={referenceId}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入模型 ID"
          className="input-minimal text-sm"
        />
      </div>

      <VoiceExplorer onSelect={(id) => onChange(id)} />
    </div>
  );
}
