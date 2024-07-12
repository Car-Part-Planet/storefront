import Breadcrumb from 'components/breadcrumb';
import BreadcrumbHome from 'components/breadcrumb/breadcrumb-home';
import YMMFilters, { YMMFiltersPlaceholder } from 'components/filters';
import ProductsList from 'components/layout/products-list';
import { searchProducts } from 'components/layout/products-list/actions';
import FiltersContainer, {
  FiltersListPlaceholder
} from 'components/layout/search/filters/filters-container';
import { HeaderPlaceholder } from 'components/layout/search/header';
import ProductsGridPlaceholder from 'components/layout/search/placeholder';
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
  const searchHandle = searchValue || '';

  return (
    <>
      <div className="mx-auto mt-6 max-w-screen-2xl px-8 pb-10">
        <div className="grid lg:grid-cols-3 lg:gap-x-10 xl:grid-cols-4">
          <aside className="hidden lg:block">
            <div className="mb-5">
              <Suspense fallback={<YMMFiltersPlaceholder />}>
                <YMMFilters />
              </Suspense>
            </div>
            <h3 className="sr-only">Filters</h3>
            <Suspense fallback={<FiltersListPlaceholder />} key={`filters-${searchValue}`}>
              <FiltersContainer searchParams={searchParams} collection="dummy" />
            </Suspense>
          </aside>
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="mb-2">
              <Suspense fallback={<BreadcrumbHome />} key={`breadcrumb-${searchValue}`}>
                <Breadcrumb type="search" handle={searchHandle} />
              </Suspense>
            </div>
            <Suspense fallback={<HeaderPlaceholder />} key={`header-${searchValue}`}>
              <div className="mb-3 mt-3 max-w-5xl lg:mb-1">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Search results for &quot;{searchValue}&quot;
                </h1>
              </div>
            </Suspense>
            <div className="mb-5 flex w-full items-center justify-between gap-2 lg:justify-end">
              <SortingMenu />
            </div>
            <Suspense fallback={<ProductsGridPlaceholder />} key={`products-${searchValue}`}>
              {products.length === 0 ? (
                <p className="py-3 text-lg">{`No products found for "${searchValue}"`}</p>
              ) : (
                <ProductsList
                  initialProducts={products}
                  pageInfo={pageInfo}
                  collection={searchValue}
                  searchParams={searchParams}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
