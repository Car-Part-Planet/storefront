import { URL_PREFIXES } from 'lib/constants';
import { ensureLoggedIn, getOrigin } from 'lib/shopify/auth';
import { createUrl } from 'lib/utils';
import { getRedirectData } from 'lib/vercel-kv';
import { NextRequest, NextResponse } from 'next/server';

const shouldRemoveSearchParams = (search: string) => {
  const paramString = search.split('?')[1];
  if (!paramString) {
    return true;
  }
  const searchParams = new URLSearchParams(paramString);
  if (searchParams.has('tag') || searchParams.has('code')) {
    return false;
  }
  return true;
};

const isProd = process.env.NODE_ENV === 'production';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/account')) {
    const origin = getOrigin(request);

    return await ensureLoggedIn(request, origin);
  }

  // only enable redirect logic on production
  if (isProd) {
    const search = request.nextUrl.search; // get the search query string
    let destination;

    if (!search || shouldRemoveSearchParams(search)) {
      destination = await getRedirectData(pathname);
    } else {
      const searchParams = new URLSearchParams(search);
      const newSearchParams = new URLSearchParams();
      ['tag', 'code'].forEach((key) => {
        if (searchParams.has(key)) {
          newSearchParams.set(key, searchParams.get(key)!);
        }
      });
      destination = await getRedirectData(createUrl(pathname, newSearchParams));
    }

    if (destination) {
      const newSearchParams = new URLSearchParams(search);
      newSearchParams.delete('tag');
      newSearchParams.delete('code');
      return NextResponse.redirect(
        new URL(createUrl(destination, newSearchParams), request.url),
        301
      );
    }
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
    '/((?!api|_next/static|icons|images|logo|_next/image|favicon.ico|product|cart).*)'
  ]
};
