import { URL_PREFIXES } from 'lib/constants';
import { getOrigin, isLoggedIn } from 'lib/shopify/auth';
import { getRedirectData } from 'lib/vercel-kv';
import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log('client ip adress', request.ip);
  console.log('user agent', request.headers.get('user-agent'));

  // If the user agent is Googlebot, return a 503 status code to disable crawling
  const userAgent = request.headers.get('user-agent') || '';
  if (/Googlebot/.test(userAgent)) {
    const response = new NextResponse('Service Unavailable', { status: 503 });
    response.headers.set('Retry-After', '3600');
    response.headers.delete('X-Robots-Tag'); // Remove the x-robots-tag header
    return response;
  }

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/account')) {
    const origin = getOrigin(request);

    return await isLoggedIn(request, origin);
  }

  const search = request.nextUrl.search;
  const destination = await getRedirectData(search ? `${pathname}${search}` : pathname);
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url, 301);
  }

  if (URL_PREFIXES.some((url) => pathname.startsWith(url))) {
    // /transmissions/bmw/x5 would turn into /transmissions-bmw-x5
    const requestPathname = pathname.split('/').filter(Boolean).join('_');
    const searchString = request.nextUrl.search;

    return NextResponse.rewrite(
      new URL(
        searchString ? `/search/${requestPathname}${searchString}` : `/search/${requestPathname}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

// TODO: Uncomment this code when remove the googlebot middleware
// export const config = {
//   matcher: [
//     '/account/:path*',
//     '/transmissions/:path*',
//     '/engines/:path*',
//     '/transfer-cases/:path*',
//     '/remanufactured-engines/:path*'
//   ]
// };

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons
     * - images
     */
    {
      source: '/((?!api|_next/static|icons|images|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    },
    {
      source: '/((?!api|_next/static|icons|images|_next/image|favicon.ico).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    },
    {
      source: '/((?!api|_next/static|icons|images|_next/image|favicon.ico).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }]
    }
  ]
};
