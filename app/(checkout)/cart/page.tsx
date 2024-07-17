import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import ButtonGroups from 'components/cart/button-groups';
import CartDetails from 'components/cart/cart-details';
import { getCart } from 'lib/shopify';
import { cookies } from 'next/headers';

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

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Cart</h1>
      <CartDetails cart={cart} />
    </div>
  );
}
