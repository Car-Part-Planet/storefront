import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import ButtonGroups from 'components/cart/button-groups';
import CartDetails from 'components/cart/cart-details';
import { isLoggedIn } from 'components/profile/actions';
import { getCart } from 'lib/shopify';
import { cookies } from 'next/headers';

const getCheckoutUrlWithAuthentication = (url: string) => {
  const checkoutUrl = new URL(url);
  checkoutUrl.searchParams.append('logged_in', 'true');
  return checkoutUrl.toString();
};

export default async function Page() {
  const cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
        <ShoppingCartIcon className="h-16" />
        <p className="mb-3 mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
        <ButtonGroups />
      </div>
    );
  }

  const isAuthenticated = await isLoggedIn();
  const checkoutUrl = isAuthenticated
    ? getCheckoutUrlWithAuthentication(cart.checkoutUrl)
    : cart.checkoutUrl;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Cart</h1>
      <CartDetails cart={cart} checkoutUrl={checkoutUrl} />
    </div>
  );
}
