'use client';

import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OpenCart from './open-cart';

const CartWrapper = ({ quantity }: { quantity?: number }) => {
  const searchParams = useSearchParams();
  const url = createUrl('/cart', searchParams);

  return (
    <Link href={url}>
      <OpenCart quantity={quantity} />
    </Link>
  );
};

export default CartWrapper;
