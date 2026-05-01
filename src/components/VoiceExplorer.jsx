import { useState, useRef } from 'react';
import { Search, Loader2, Play, Pause, Plus, Globe } from 'lucide-react';
import { proxyAudioUrl } from '../utils/proxy';

export default function VoiceExplorer({ onSelect }) {
  const [query, setQuery] = useState('');
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [searched, setSearched] = useState(false);
  const audioRef = useRef(null);
  const searchTimer = useRef(null);

  const searchVoices = async (q, page = 0) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const url = `/api/fish/model?language=zh&page_size=20&title=${encodeURIComponent(q.trim())}&page=${page}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (page === 0) {
        setVoices(data.items || []);
      } else {
        setVoices(prev => [...prev, ...(data.items || [])]);
      }
      setHasMore(data.has_more && data.items?.length > 0);
      setSearched(true);
      setExpanded(true);
    } catch (err) {
      setError('搜索失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchVoices(query, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLoadMore = () => {
    searchVoices(query, voices.length / 20);
  };

  const handlePreview = (voiceId, sampleUrl) => {
    if (!sampleUrl) return;
    if (playingId === voiceId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(proxyAudioUrl(sampleUrl));
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    setPlayingId(voiceId);
  };

  const handleSelect = (voice) => {
    onSelect(voice._id);
  };

  return (
    <div className="border-t border-slate-100 pt-4">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all"
        >
          <Globe className="w-4 h-4" />
          搜索全部官方音色库
        </button>
      ) : (
        <div className="space-y-3">
          {/* 搜索栏 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索音色名称，如温柔、御姐、男声..."
                className="input-minimal pl-9 text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '搜索'}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* 搜索结果数量 */}
          {searched && !loading && (
            <p className="text-xs text-slate-400">
              {voices.length > 0 ? `找到 ${voices.length} 个匹配的音色` : '未找到匹配的音色，试试其他关键词'}
            </p>
          )}

          {/* 音色列表 */}
          {voices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {voices.map((voice) => {
                const sampleUrl = voice.samples?.[0]?.audio;
                return (
                  <div
                    key={voice._id}
                    className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate">{voice.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5" title={voice._id}>
                          {voice._id.slice(0, 16)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {sampleUrl && (
                          <span
                            onClick={(e) => { e.stopPropagation(); handlePreview(voice._id, sampleUrl); }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                              ${playingId === voice._id
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                            title={playingId === voice._id ? '暂停' : '试听'}
                          >
                            {playingId === voice._id
                              ? <Pause className="w-3 h-3" />
                              : <Play className="w-3 h-3 ml-0.5" />
                            }
                          </span>
                        )}
                        <button
                          onClick={() => handleSelect(voice)}
                          className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                          title="选择此音色"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {voice.description && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-2 line-clamp-2">{voice.description}</p>
                    )}
                    {voice.tags && voice.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {voice.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="px-1 py-0.5 text-[9px] rounded bg-slate-100 text-slate-400">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 加载更多 */}
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full py-2 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '加载更多'}
            </button>
          )}

          {/* 收起 */}
          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="w-full py-2 text-xs text-slate-300 hover:text-slate-400 transition-colors"
            >
              收起音色搜索
            </button>
          )}
        </div>
      )}
    </div>
  );
}
