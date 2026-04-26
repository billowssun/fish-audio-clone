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
    // 将流式 body 完整读取为 Buffer，防止 fetch 自动使用 Transfer-Encoding: chunked
    // 因为许多 Python 后端（FastAPI 等）在解析 multipart/form-data 时若没有 Content-Length 会直接报 400
    const bodyBuffer = await req.arrayBuffer();
    fetchOptions.body = bodyBuffer;
    // 取消 duplex 参数，因为 body 已经不再是 stream
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
