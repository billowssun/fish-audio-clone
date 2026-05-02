import { corsHeaders, handleOptions, jsonResponse, rejectInvalidMethod, rejectInvalidOrigin } from '../_shared.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const originError = rejectInvalidOrigin(req);
  if (originError) return originError;

  if (req.method === 'OPTIONS') {
    return handleOptions(['POST', 'OPTIONS']);
  }

  const methodError = rejectInvalidMethod(req, ['POST']);
  if (methodError) return methodError;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: '服务端未配置 GROQ_API_KEY 环境变量，请在 Vercel 控制台设置。' }, 401);
  }

  try {
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    const maxSize = 25 * 1024 * 1024;
    if (contentLength > maxSize) {
      return jsonResponse({ error: '音频文件过大，请上传 25MB 以内的文件' }, 413);
    }

    const formData = await req.formData();
    const audioFile = formData.get('file');
    const prompt = formData.get('prompt');

    if (!audioFile) {
      return jsonResponse({ error: '请求中缺少音频文件 (file 字段)' }, 400);
    }

    if (audioFile.size > maxSize) {
      return jsonResponse({ error: '音频文件过大，请上传 25MB 以内的文件' }, 413);
    }

    const outFormData = new FormData();
    outFormData.append('file', audioFile);
    outFormData.append('model', 'whisper-large-v3-turbo');
    outFormData.append('response_format', 'json');
    if (typeof prompt === 'string' && prompt.trim()) {
      outFormData.append('prompt', prompt.trim());
    }

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: outFormData,
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (err) {
    console.error('ASR proxy error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}
