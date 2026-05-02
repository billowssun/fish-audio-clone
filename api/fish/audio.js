export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Only proxy Fish Audio-owned HTTPS assets. Fish may return different
  // subdomains for public samples, so keep the boundary at the parent domain.
  try {
    const parsedTarget = new URL(targetUrl);
    const targetHost = parsedTarget.hostname;
    const isFishAudioHost = targetHost === 'fish.audio' || targetHost.endsWith('.fish.audio');

    if (parsedTarget.protocol !== 'https:' || !isFishAudioHost) {
      return new Response(JSON.stringify({ error: 'Forbidden host' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(targetUrl);

    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'audio/mpeg');
    headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
