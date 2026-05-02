import { corsHeaders, handleOptions, jsonResponse, rejectInvalidMethod, rejectInvalidOrigin } from '../../_shared.js';

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

  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: '服务端未配置 FISH_AUDIO_API_KEY 环境变量，请在 Vercel 控制台设置。' }, 401);
  }

  const url = new URL(req.url);
  const targetUrl = `https://api.fish.audio/v1/tts${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');
  headers.set('Authorization', `Bearer ${apiKey}`);

  const bodyBuffer = await req.arrayBuffer();

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: bodyBuffer,
      redirect: 'manual',
    });

    const resHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders())) {
      resHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
