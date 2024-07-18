import { URL_PREFIXES } from 'lib/constants';
import { ensureLoggedIn, getOrigin } from 'lib/shopify/auth';
import { getRedirectData } from 'lib/vercel-kv';
import { NextRequest, NextResponse } from 'next/server';

const shouldRemoveSearchParams = (search: string) => {
  const paramString = search.split('?')[1];
  console.log({ paramString });
  if (!paramString) {
    return true;
  }
  const searchParams = new URLSearchParams(paramString);
  if (searchParams.size === 1 && (searchParams.has('tag') || searchParams.has('code'))) {
    return false;
  }
  return true;
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log('client ip adress', request.ip);

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/account')) {
    const origin = getOrigin(request);

    return await ensureLoggedIn(request, origin);
  }

  const search = request.nextUrl.search; // get the search query string
  let destination;

  if (!search || shouldRemoveSearchParams(search)) {
    destination = await getRedirectData(pathname);
  } else {
    destination = await getRedirectData(`${pathname}${decodeURIComponent(search)}`);
  }

  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), 301);
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
     * - logo
     */
    {
      source: '/((?!api|_next/static|icons|images|logo|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    },
    {
      source: '/((?!api|_next/static|icons|images|logo|_next/image|favicon.ico).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    },
    {
      source: '/((?!api|_next/static|icons|images|logo|_next/image|favicon.ico).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }]
    }
  ]
};
