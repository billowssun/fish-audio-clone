export function proxyAudioUrl(directUrl) {
  if (!directUrl) return null;
  return `/api/fish/audio?url=${encodeURIComponent(directUrl)}`;
}
