import { URL_PREFIXES } from 'lib/constants';
import { getOrigin, isLoggedIn } from 'lib/shopify/auth';
import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  if (/Googlebot/.test(userAgent)) {
    const response = new NextResponse('Service Unavailable', { status: 503 });
    response.headers.set('Retry-After', '3600');
    response.headers.delete('x-robots-tag'); // Remove the x-robots-tag header
    return response;
  }

  if (request.nextUrl.pathname.startsWith('/account')) {
    const origin = getOrigin(request);

    return await isLoggedIn(request, origin);
  }

  if (URL_PREFIXES.some((url) => request.nextUrl.pathname.startsWith(url))) {
    // /transmissions/bmw/x5 would turn into /transmissions-bmw-x5
    const requestPathname = request.nextUrl.pathname.split('/').filter(Boolean).join('_');
    const searchString = request.nextUrl.search;

    return NextResponse.rewrite(
      new URL(
        searchString ? `/search/${requestPathname}${searchString}` : `/search/${requestPathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    '/account/:path*',
    '/transmissions/:path*',
    '/engines/:path*',
    '/transfer-cases/:path*',
    '/remanufactured-engines/:path*',
    {
      // Custom matcher function to match all requests from Googlebot
      source: '/',
      has: [
        {
          type: 'header',
          key: 'user-agent',
          value: '(?i)Googlebot' // Case-insensitive match for Googlebot
        }
      ]
    },
    {
      // Custom matcher function to match all requests from Googlebot
      source: '/:path*',
      has: [
        {
          type: 'header',
          key: 'user-agent',
          value: '(?i)Googlebot' // Case-insensitive match for Googlebot
        }
      ]
    }
  ]
};
