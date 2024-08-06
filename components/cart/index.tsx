import { getCart } from 'lib/shopify';
import { cookies } from 'next/headers';
import CartWrapper from './cart-wrapper';

export default async function Cart() {
  const cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartWrapper quantity={cart?.totalQuantity} />;
}
