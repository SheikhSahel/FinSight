import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CACHE_TTL_MS = 60_000;
const STALE_TTL_MS = 10 * 60_000;

interface CachedResponse {
  body: string;
  contentType: string;
  expiresAt: number;
  staleUntil: number;
}

interface UpstreamResponse {
  body: string;
  contentType: string;
  ok: boolean;
  status: number;
}

const responseCache = new Map<string, CachedResponse>();
const inFlightRequests = new Map<string, Promise<UpstreamResponse>>();

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const endpoint = path.join('/');
  const upstreamUrl = new URL(`${COINGECKO_API}/${endpoint}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });
  const cacheKey = upstreamUrl.toString();
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return new NextResponse(cached.body, {
      headers: {
        'Content-Type': cached.contentType,
        'X-Data-Cache': 'fresh',
      },
    });
  }

  try {
    let requestPromise = inFlightRequests.get(cacheKey);
    if (!requestPromise) {
      requestPromise = fetch(upstreamUrl, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }).then(async (response) => ({
        body: await response.text(),
        contentType: response.headers.get('Content-Type') || 'application/json',
        ok: response.ok,
        status: response.status,
      }));
      inFlightRequests.set(cacheKey, requestPromise);
    }

    const response = await requestPromise;
    inFlightRequests.delete(cacheKey);
    const { body, contentType } = response;

    if (response.ok) {
      responseCache.set(cacheKey, {
        body,
        contentType,
        expiresAt: Date.now() + CACHE_TTL_MS,
        staleUntil: Date.now() + STALE_TTL_MS,
      });
    } else if (response.status === 429 && cached && cached.staleUntil > Date.now()) {
      return new NextResponse(cached.body, {
        headers: {
          'Content-Type': cached.contentType,
          'X-Data-Cache': 'stale',
        },
      });
    }

    return new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    inFlightRequests.delete(cacheKey);
    if (cached && cached.staleUntil > Date.now()) {
      return new NextResponse(cached.body, {
        headers: {
          'Content-Type': cached.contentType,
          'X-Data-Cache': 'stale',
        },
      });
    }
    console.error('CoinGecko proxy request failed:', error);
    return NextResponse.json(
      { error: 'Unable to reach the market data provider.' },
      { status: 502 }
    );
  }
}
