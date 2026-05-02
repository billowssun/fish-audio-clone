export function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    ...extra,
  };
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(extraHeaders),
    },
  });
}

export function rejectInvalidOrigin(req) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (!allowedOrigin) return null;

  const origin = req.headers.get('origin');
  if (origin && origin !== allowedOrigin) {
    return jsonResponse({ error: 'Forbidden origin' }, 403);
  }

  return null;
}

export function handleOptions(allowedMethods, allowedHeaders = 'Content-Type') {
  return new Response(null, {
    status: 204,
    headers: corsHeaders({
      'Access-Control-Allow-Methods': allowedMethods.join(', '),
      'Access-Control-Allow-Headers': allowedHeaders,
    }),
  });
}

export function rejectInvalidMethod(req, allowedMethods) {
  if (allowedMethods.includes(req.method)) return null;

  return jsonResponse(
    { error: 'Method not allowed' },
    405,
    { Allow: allowedMethods.join(', ') },
  );
}
