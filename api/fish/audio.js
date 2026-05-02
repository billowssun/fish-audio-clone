import { corsHeaders, handleOptions, jsonResponse, rejectInvalidMethod, rejectInvalidOrigin } from '../_shared.js';

export const config = {
  runtime: 'edge',
};

function isAllowedFishAudioAsset(targetUrl) {
  const parsedTarget = new URL(targetUrl);
  const targetHost = parsedTarget.hostname;
  const isFishAudioHost = targetHost === 'fish.audio' || targetHost.endsWith('.fish.audio');

  return parsedTarget.protocol === 'https:' && isFishAudioHost;
}

export default async function handler(req) {
  const originError = rejectInvalidOrigin(req);
  if (originError) return originError;

  if (req.method === 'OPTIONS') {
    return handleOptions(['GET', 'OPTIONS']);
  }

  const methodError = rejectInvalidMethod(req, ['GET']);
  if (methodError) return methodError;

  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return jsonResponse({ error: 'Missing url parameter' }, 400);
  }

  try {
    if (!isAllowedFishAudioAsset(targetUrl)) {
      return jsonResponse({ error: 'Forbidden host' }, 403);
    }
  } catch {
    return jsonResponse({ error: 'Invalid URL' }, 400);
  }

  try {
    const response = await fetch(targetUrl);

    const headers = new Headers(corsHeaders({
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    }));

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
