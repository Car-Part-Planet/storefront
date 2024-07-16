import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface AccessTokenResponseBody {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  error?: string;
  error_description?: string;
}

export type AccessTokenResponse = Promise<
  | {
      success: false;
      data?: undefined;
    }
  | {
      success: true;
      data: AccessTokenResponseBody;
    }
>;

export const CUSTOMER_API_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL!;
export const CUSTOMER_API_CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID || '';
export const ORIGIN_URL = process.env.SHOPIFY_ORIGIN_URL || '';
export const USER_AGENT = '*';

export async function generateCodeVerifier() {
  const randomCode = generateRandomCode();
  return base64UrlEncode(randomCode);
}

export async function generateCodeChallenge(codeVerifier: string) {
  const digestOp = await crypto.subtle.digest(
    { name: 'SHA-256' },
    new TextEncoder().encode(codeVerifier)
  );
  const hash = convertBufferToString(digestOp);
  return base64UrlEncode(hash);
}

function generateRandomCode() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return String.fromCharCode.apply(null, Array.from(array));
}

function base64UrlEncode(str: string) {
  const base64 = btoa(str);
  // This is to ensure that the encoding does not have +, /, or = characters in it.
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function convertBufferToString(hash: ArrayBuffer) {
  const uintArray = new Uint8Array(hash);
  const numberArray = Array.from(uintArray);
  return String.fromCharCode(...numberArray);
}

export async function generateRandomString() {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  return timestamp + randomString;
}

export function getNonce(token: string) {
  return decodeJwt(token).payload.nonce;
}

function decodeJwt(token: string) {
  const [header, payload, signature] = token.split('.');

  const decodedHeader = JSON.parse(atob(header || ''));
  const decodedPayload = JSON.parse(atob(payload || ''));

  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature
  };
}

export async function generateLoginUrlServerAction() {
  const customerAccountUrl = CUSTOMER_API_URL;
  const clientId = CUSTOMER_API_CLIENT_ID;
  const origin = ORIGIN_URL;
  const loginUrl = new URL(`${customerAccountUrl}/auth/oauth/authorize`);

  const state = await generateRandomString();
  const nonce = await generateRandomString();

  loginUrl.searchParams.set('client_id', clientId);
  loginUrl.searchParams.append('response_type', 'code');
  loginUrl.searchParams.append('redirect_uri', `${origin}/api/authorize`);
  loginUrl.searchParams.set(
    'scope',
    'openid email https://api.customers.com/auth/customer.graphql'
  );
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  cookies().set('shop_verifier', verifier as string, {});
  cookies().set('shop_state', state as string, {});
  cookies().set('shop_nonce', nonce as string, {});

  loginUrl.searchParams.append('state', state);
  loginUrl.searchParams.append('nonce', nonce);
  loginUrl.searchParams.append('code_challenge', challenge);
  loginUrl.searchParams.append('code_challenge_method', 'S256');

  return loginUrl;
}

export async function generateLoginRedirectResponse() {
  const customerAccountUrl = CUSTOMER_API_URL;
  const clientId = CUSTOMER_API_CLIENT_ID;
  const origin = ORIGIN_URL;
  const loginUrl = new URL(`${customerAccountUrl}/auth/oauth/authorize`);

  const state = await generateRandomString();
  const nonce = await generateRandomString();

  loginUrl.searchParams.set('client_id', clientId);
  loginUrl.searchParams.append('response_type', 'code');
  loginUrl.searchParams.append('redirect_uri', `${origin}/api/authorize`);
  loginUrl.searchParams.set(
    'scope',
    'openid email https://api.customers.com/auth/customer.graphql'
  );
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  loginUrl.searchParams.append('state', state);
  loginUrl.searchParams.append('nonce', nonce);
  loginUrl.searchParams.append('code_challenge', challenge);
  loginUrl.searchParams.append('code_challenge_method', 'S256');

  let response = NextResponse.redirect(loginUrl.toString());

  response = removeAllCookies(response);
  response.cookies.set('shop_verifier', verifier as string, {});
  response.cookies.set('shop_state', state as string, {});
  response.cookies.set('shop_nonce', nonce as string, {});
  return response;
}

export async function initialAccessToken(
  request: NextRequest,
  newOrigin: string,
  customerAccountId: string,
  customerAccountUrl: string
): AccessTokenResponse {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');

  /*
  STEP 1: Check for all necessary cookies
  */
  if (!code || !state) {
    console.log('No code or state parameter found in the redirect URL.');
    return { success: false };
  }

  const sessionState = request.cookies.get('shop_state')?.value;

  if (state !== sessionState) {
    console.log(
      'The session state does not match the state parameter. Make sure that the session is configured correctly and passed to `createCustomerAccountClient`.'
    );
    return { success: false };
  }

  const codeVerifier = request.cookies.get('shop_verifier')?.value;

  if (!codeVerifier) {
    console.log('No Code Verifier');
    return { success: false };
  }

  /*
  STEP 2: Get Access Token
  */
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('client_id', customerAccountId);
  body.append('redirect_uri', `${newOrigin}/api/authorize`);
  body.append('code', code);
  body.append('code_verifier', codeVerifier);

  const userAgent = '*';
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('User-Agent', userAgent);
  headers.append('Origin', newOrigin || '');

  const url = `${customerAccountUrl}/auth/oauth/token`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
    cache: 'no-store'
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(error);
    console.log('response auth', response.status);
    return { success: false };
  }

  const data: AccessTokenResponseBody = await response.json();

  const responseNonce = await getNonce(data.id_token);
  const sessionNonce = request.cookies.get('shop_nonce')?.value;

  if (responseNonce !== sessionNonce) {
    console.log(`Returned nonce does not match: ${sessionNonce} !== ${responseNonce}`);
    return { success: false };
  }

  return { success: true, data };
}

export async function exchangeAccessToken(
  accessToken: string,
  customerAccountId: string,
  customerAccountApiUrl: string,
  origin: string
): AccessTokenResponse {
  /**
   * this is a constant - see the docs.
   * https://shopify.dev/docs/api/customer#useaccesstoken-propertydetail-audience
   */
  const customerApiClientId = '30243aa5-17c1-465a-8493-944bcc4e88aa';
  const clientId = customerAccountId;

  const body = new URLSearchParams();
  body.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
  body.append('client_id', clientId);
  body.append('audience', customerApiClientId);
  body.append('subject_token', accessToken);
  body.append('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token');
  body.append('scopes', 'https://api.customers.com/auth/customer.graphql');

  const userAgent = '*';

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('User-Agent', userAgent);
  headers.append('Origin', origin);

  const url = `${customerAccountApiUrl}/auth/oauth/token`;
  // Token Endpoint goes here
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
    cache: 'no-store'
  });

  const data: AccessTokenResponseBody = await response.json();

  if (data.error) {
    console.log(data.error_description);
    return { success: false };
  }
  return { success: true, data };
}

export async function refreshToken({ request, origin }: { request: NextRequest; origin: string }) {
  const newBody = new URLSearchParams();
  const refreshToken = request.cookies.get('shop_refresh_token')?.value;

  if (!refreshToken) {
    console.log(
      'No refreshToken found in the session. Make sure your session is configured correctly.'
    );
    return { success: false, message: `no_refresh_token` };
  }

  const clientId = CUSTOMER_API_CLIENT_ID;
  newBody.append('grant_type', 'refresh_token');
  newBody.append('refresh_token', refreshToken);
  newBody.append('client_id', clientId);
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    'User-Agent': USER_AGENT,
    Origin: origin
  };
  const tokenRequestUrl = `${CUSTOMER_API_URL}/auth/oauth/token`;
  const response = await fetch(tokenRequestUrl, {
    method: 'POST',
    headers,
    body: newBody
  });

  if (!response.ok) {
    const text = await response.text();
    console.log('response error in refresh token', text);
    return { success: false, message: `no_refresh_token` };
  }
  const data = await response.json();
  const { access_token, expires_in, refresh_token } = data;

  const customerAccessToken = await exchangeAccessToken(
    access_token,
    clientId,
    CUSTOMER_API_URL,
    origin
  );
  // console.log("Customer Access Token in refresh request", customerAccessToken)
  if (!customerAccessToken.success) {
    return { success: false, message: `no_refresh_token` };
  }

  //const expiresAt = new Date(new Date().getTime() + (expires_in - 120) * 1000).getTime() + ''
  //const idToken = id_token

  return {
    success: true,
    data: { customerAccessToken: customerAccessToken.data.access_token, expires_in, refresh_token }
  };
}

export async function checkExpires({
  request,
  expiresAt,
  origin
}: {
  request: NextRequest;
  expiresAt: string;
  origin: string;
}) {
  let isExpired = false;
  if (parseInt(expiresAt, 10) - 1000 < new Date().getTime()) {
    isExpired = true;
    const refresh = await refreshToken({ request, origin });
    return { ranRefresh: isExpired, refresh };
  }
  return { ranRefresh: isExpired, success: true };
}

export function removeAllCookies(response: NextResponse) {
  //response.cookies.delete('shop_auth_token') //never set. We don't use it anywhere.
  response.cookies.delete('shop_customer_token');
  response.cookies.delete('shop_refresh_token');
  response.cookies.delete('shop_id_token');
  response.cookies.delete('shop_state');
  response.cookies.delete('shop_nonce');
  response.cookies.delete('shop_verifier');
  response.cookies.delete('shop_expires_at');
  return response;
}

export async function removeAllCookiesServerAction() {
  cookies().delete('shop_customer_token');
  cookies().delete('shop_refresh_token');
  cookies().delete('shop_id_token');
  cookies().delete('shop_state');
  cookies().delete('shop_nonce');
  cookies().delete('shop_verifier');
  cookies().delete('shop_expires_at');
  return { success: true };
}

export async function createAllCookies({
  response,
  accessToken,
  expires_in,
  refresh_token,
  expiresAt,
  id_token
}: {
  response: NextResponse;
  accessToken: string;
  expires_in: number;
  refresh_token: string;
  expiresAt: string;
  id_token?: string;
}) {
  response.cookies.set('shop_customer_token', accessToken, {
    httpOnly: true, //if true can only read the cookie in server
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: expires_in //value from shopify, seems like this is 2 hours
  });

  //you need to set an expiration here, because otherwise its a sessions cookie
  //and will disappear after the user closes the browser and then we can never refresh - same with expires at below
  response.cookies.set('shop_refresh_token', refresh_token, {
    httpOnly: true, //if true can only read the cookie in server
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 604800 //one week
  });

  //you need to set an expiration here, because otherwise its a sessions cookie
  //and will disappear after the user closes the browser and then we can never refresh
  response.cookies.set('shop_expires_at', expiresAt, {
    httpOnly: true, //if true can only read the cookie in server
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 604800 //one week
  });

  //required for logout - this must be the same as the original expires - it;s long lived so they can logout, otherwise it will expire
  //because that's how we got the token, if this is different, it won't work
  //we don't always send in id_token here. For example, on refresh it's not available, it's only sent in on the initial authorization
  if (id_token) {
    response.cookies.set('shop_id_token', id_token, {
      httpOnly: true, //if true can only read the cookie in server
      sameSite: 'lax', //should be lax???
      secure: true,
      path: '/',
      maxAge: 604800 //one week
    });
  }

  return response;
}

export async function ensureLoggedIn(request: NextRequest, origin: string) {
  const accessToken = request.cookies.get('shop_customer_token')?.value;
  const refreshToken = request.cookies.get('shop_refresh_token')?.value;
  const expiresAt = request.cookies.get('shop_expires_at')?.value;
  const loginRedirectResponse = await generateLoginRedirectResponse();

  const newHeaders = new Headers(request.headers);

  if ((!accessToken && !refreshToken) || !expiresAt) {
    return loginRedirectResponse;
  }

  const isExpired = await checkExpires({
    request,
    expiresAt,
    origin
  });

  //only execute the code below to reset the cookies if it was expired!
  if (isExpired.ranRefresh) {
    const isSuccess = isExpired?.refresh?.success;
    if (!isSuccess) {
      return loginRedirectResponse;
    } else {
      const refreshData = isExpired?.refresh?.data;
      const newCustomerAccessToken = refreshData?.customerAccessToken;
      const expires_in = refreshData?.expires_in;
      const expiresAt = new Date(new Date().getTime() + (expires_in - 120) * 1000).getTime() + '';
      newHeaders.set('x-shop-customer-token', `${newCustomerAccessToken}`);
      const resetCookieResponse = NextResponse.next({
        request: {
          headers: newHeaders
        }
      });
      return await createAllCookies({
        response: resetCookieResponse,
        accessToken: newCustomerAccessToken as string,
        expires_in,
        refresh_token: refreshData?.refresh_token,
        expiresAt
      });
    }
  }

  newHeaders.set('x-shop-customer-token', `${accessToken}`);
  return NextResponse.next({
    request: {
      // New request headers
      headers: newHeaders
    }
  });
}

//when we are running on the production website we just get the origin from the request.nextUrl
export function getOrigin(request: NextRequest) {
  const nextOrigin = request.nextUrl.origin;
  //when running localhost, we want to use fake origin otherwise we use the real origin
  let newOrigin = nextOrigin;
  if (nextOrigin === 'https://localhost:3000' || nextOrigin === 'http://localhost:3000') {
    newOrigin = ORIGIN_URL;
  } else {
    newOrigin = nextOrigin;
  }
  return newOrigin;
}

export async function authorize(request: NextRequest, origin: string) {
  const customerAccountId = CUSTOMER_API_CLIENT_ID;
  const customerAccountUrl = CUSTOMER_API_URL;

  const newHeaders = new Headers(request.headers);

  /**
   * STEP 1: Get the initial access token or deny access
   */
  const { success, data } = await initialAccessToken(
    request,
    origin,
    customerAccountId,
    customerAccountUrl
  );

  if (!success) {
    newHeaders.set('x-shop-access', 'denied');
    return NextResponse.json({
      request: {
        headers: newHeaders
      }
    });
  }

  const { access_token, expires_in, id_token, refresh_token } = data;

  /**
   * STEP 2: Get a Customer Access Token
   */
  const customerAccessToken = await exchangeAccessToken(
    access_token,
    customerAccountId,
    customerAccountUrl,
    origin || ''
  );

  if (!customerAccessToken.success) {
    newHeaders.set('x-shop-access', 'denied');
    return NextResponse.json({
      request: {
        headers: newHeaders
      }
    });
  }

  /**
   * STEP 3: Set Customer Access Token cookies
   **/
  newHeaders.set('x-shop-access', 'allowed');

  const accountUrl = new URL(`${origin}/account`);
  const authResponse = NextResponse.redirect(`${accountUrl}`);

  const expiresAt = new Date(new Date().getTime() + (expires_in! - 120) * 1000).getTime() + '';

  return await createAllCookies({
    response: authResponse,
    accessToken: customerAccessToken.data.access_token,
    expires_in,
    refresh_token,
    expiresAt,
    id_token
  });
}
