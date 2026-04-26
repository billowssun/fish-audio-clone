export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 当前文件的路径恰好对应前端的 /api/fish/v1/tts
  // 我们直接将其转发给 https://api.fish.audio/v1/tts
  const url = new URL(req.url);
  const targetUrl = `https://api.fish.audio/v1/tts${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');

  const fetchOptions = {
    method: req.method,
    headers: headers,
    redirect: 'manual',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = req.body;
    fetchOptions.duplex = 'half';
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    
    const resHeaders = new Headers(response.headers);
    resHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
