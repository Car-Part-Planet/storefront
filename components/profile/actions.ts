'use server';

import {
  CUSTOMER_API_URL,
  ORIGIN_URL,
  generateLoginUrlServerAction,
  removeAllCookiesServerAction
} from 'lib/shopify/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * We construct a url for the Shopify Customer Account API
 * that will redirect the user to the Shopify login page.
 *
 * https://shopify.dev/docs/api/customer#step-authorization
 */
export async function login() {
  const loginUrl = generateLoginUrlServerAction();

  redirect(loginUrl.toString()); // Navigate to the new post page
}

export async function isLoggedIn() {
  const customerToken = cookies().get('shop_customer_token')?.value;
  const refreshToken = cookies().get('shop_refresh_token')?.value;

  if (!customerToken && !refreshToken) {
    return false;
  } else {
    return true;
  }
}

export async function logout() {
  const idToken = cookies().get('shop_id_token');
  const idTokenValue = idToken?.value;

  await removeAllCookiesServerAction();

  if (!idTokenValue) {
    redirect(ORIGIN_URL);
  }

  const logoutUrl = new URL(
    `${CUSTOMER_API_URL}/auth/logout?id_token_hint=${idTokenValue}&post_logout_redirect_uri=${ORIGIN_URL}`
  );

  redirect(logoutUrl.toString());
}
