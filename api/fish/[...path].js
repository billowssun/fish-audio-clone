export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const targetPath = url.pathname.replace('/api/fish', '');
  const targetUrl = `https://api.fish.audio${targetPath}${url.search}`;

  const headers = new Headers(req.headers);
  // 删除可能导致 400 错误或跨域问题的头信息
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
    // Edge runtime 需要此参数以支持流式请求体
    fetchOptions.duplex = 'half';
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    
    // 复制响应头并添加 CORS 支持（如果需要的话，让前端能读取）
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
