export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 转发至阿里云 DashScope 的 OpenAI 兼容语音识别接口 (使用 SenseVoice)
  const targetUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/audio/transcriptions';

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');
  
  // 注入阿里云 API Key
  const apiKey = process.env.ALIYUN_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: '服务端未配置 ALIYUN_API_KEY 环境变量，请在 Vercel 控制台设置。' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  headers.set('Authorization', `Bearer ${apiKey}`);

  const fetchOptions = {
    method: req.method,
    headers: headers,
    redirect: 'manual',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // 读取完整流以计算 Content-Length，防止 Python 后端解析 multipart 报 400
    const bodyBuffer = await req.arrayBuffer();
    fetchOptions.body = bodyBuffer;
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
