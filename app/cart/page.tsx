import CartPage from 'components/cart/cart-page';
import { SearchParams } from 'lib/types';
import { Metadata } from 'next';
import { Suspense } from 'react';

const { STORE_PREFIX, SITE_NAME } = process.env;
export const metadata: Metadata = {
  title: `Cart | ${SITE_NAME}`,
  icons: {
    icon: `/logo/${STORE_PREFIX}/favicon.png`
  }
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="mx-auto max-w-screen-2xl p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Cart</h1>
        <Suspense>
          <CartPage searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
