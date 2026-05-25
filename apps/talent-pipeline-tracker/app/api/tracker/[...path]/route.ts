import { NextRequest } from 'next/server';

const TRACKER_API_BASE = process.env.TRACKER_API_URL;

function buildTargetUrl(req: NextRequest, path: string[]) {
  if (!TRACKER_API_BASE) {
    throw new Error('TRACKER_API_URL no está definido en las variables de entorno');
  }

  const cleanedPath = path.map(encodeURIComponent).join('/');
  const url = new URL(`${TRACKER_API_BASE.replace(/\/$/, '')}/${cleanedPath}`);

  for (const [key, value] of req.nextUrl.searchParams.entries()) {
    url.searchParams.append(key, value);
  }

  return url.toString();
}

function buildRequestInit(req: NextRequest): RequestInit {
  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  const accept = req.headers.get('accept');

  if (contentType) headers.set('content-type', contentType);
  if (accept) headers.set('accept', accept);

  return {
    method: req.method,
    headers,
    cache: 'no-store',
  };
}

async function handler(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(req, path);
  const init = buildRequestInit(req);

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const body = await req.text();
    if (body) init.body = body;
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();
  const contentType = upstream.headers.get('content-type');
  const status = upstream.status;
  const hasNoBodyStatus = status === 204 || status === 205 || status === 304;

  if (contentType) responseHeaders.set('content-type', contentType);

  if (hasNoBodyStatus || req.method === 'HEAD') {
    return new Response(null, {
      status,
      headers: responseHeaders,
    });
  }

  return new Response(await upstream.text(), {
    status,
    headers: responseHeaders,
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
