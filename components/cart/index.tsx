import { getCart } from 'lib/shopify';
import { cookies } from 'next/headers';
import Link from 'next/link';
import OpenCart from './open-cart';

export default async function Cart() {
  const cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return (
    <Link href="/cart">
      <OpenCart quantity={cart?.totalQuantity} />
    </Link>
  );
}
