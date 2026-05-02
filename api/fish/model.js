import { corsHeaders, handleOptions, jsonResponse, rejectInvalidMethod, rejectInvalidOrigin } from '../_shared.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const originError = rejectInvalidOrigin(req);
  if (originError) return originError;

  if (req.method === 'OPTIONS') {
    return handleOptions(['GET', 'OPTIONS']);
  }

  const methodError = rejectInvalidMethod(req, ['GET']);
  if (methodError) return methodError;

  const url = new URL(req.url);
  const targetParams = new URLSearchParams();
  for (const [key, value] of url.searchParams) {
    targetParams.set(key, value);
  }

  const targetUrl = `https://api.fish.audio/model?${targetParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders({ 'Cache-Control': 'public, max-age=300' }),
      },
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
