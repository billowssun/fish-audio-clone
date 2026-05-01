export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 使用 Groq 的 Whisper API（免费、无区域限制、速度极快）
  // 接口完全兼容 OpenAI Whisper 格式
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: '服务端未配置 GROQ_API_KEY 环境变量，请在 Vercel 控制台设置。' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 限制请求体大小，防止资源耗尽（Groq Whisper 上限 ~25MB）
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    const maxSize = 25 * 1024 * 1024;
    if (contentLength > maxSize) {
      return new Response(JSON.stringify({ error: '音频文件过大，请上传 25MB 以内的文件' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从前端请求中解析音频文件
    const formData = await req.formData();
    const audioFile = formData.get('file');

    if (!audioFile) {
      return new Response(JSON.stringify({ error: '请求中缺少音频文件 (file 字段)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 重新构造 FormData 发给 Groq
    const outFormData = new FormData();
    outFormData.append('file', audioFile);
    outFormData.append('model', 'whisper-large-v3-turbo'); // Groq 最快、最准的 Whisper 模型
    outFormData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // 不设置 Content-Type，让 fetch 自动生成正确的 multipart boundary
      },
      body: outFormData,
    });

    const text = await response.text();
    
    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      },
    });

  } catch (err) {
    console.error('ASR proxy error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
