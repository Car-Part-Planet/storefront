import YMMFilters, { YMMFiltersPlaceholder } from 'components/filters';
import MobileMMYFilters, {
  MobileMMYFiltersPlaceholder
} from 'components/filters/mobile-plp-filters';
import ProductsList from 'components/layout/products-list';
import { searchProducts } from 'components/layout/products-list/actions';
import SortingMenu from 'components/layout/search/sorting-menu';
import { Suspense } from 'react';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { q: searchValue } = searchParams as { [key: string]: string };
  const { products, pageInfo } = await searchProducts({ searchParams });
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <div className="mx-auto max-w-screen-2xl pb-10">
      <div className="mt-0 grid lg:mt-6 lg:grid-cols-3 lg:gap-x-10 xl:grid-cols-4">
        <aside className="hidden pl-8 lg:block">
          <Suspense fallback={<YMMFiltersPlaceholder />}>
            <YMMFilters />
          </Suspense>
        </aside>
        <div className="pr-0 lg:col-span-2 lg:pr-8 xl:col-span-3">
          <div className="mb-3 block lg:hidden">
            <Suspense fallback={<MobileMMYFiltersPlaceholder />}>
              <MobileMMYFilters />
            </Suspense>
          </div>
          <div className="px-8 lg:px-0">
            {searchValue ? (
              <p className="mb-4">
                {products.length === 0
                  ? 'There are no products that match '
                  : `Showing ${resultsText} for `}
                <span className="font-bold">&quot;{searchValue}&quot;</span>
              </p>
            ) : null}
            <div className="mb-5 flex w-full justify-end">
              <SortingMenu />
            </div>
            {products.length === 0 ? (
              <p className="py-3 text-lg">{`No products found in this collection`}</p>
            ) : (
              <ProductsList
                initialProducts={products}
                pageInfo={pageInfo}
                searchParams={searchParams}
                key={searchParams?.q ? (searchParams.q as string) : ''}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
