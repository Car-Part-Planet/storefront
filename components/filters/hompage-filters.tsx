import { filterTitle } from 'lib/constants';
import { getMenu } from 'lib/shopify';
import FiltersList from './filters-list';
import MobileHomePageFilter from './mobile-homepage-filters';
import { loadMMMYFilters } from './utils';

const HomePageFilters = async () => {
  const menu = await getMenu('main-menu');
  const data = await loadMMMYFilters();

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
        {filterTitle || 'Find Your Part'}
      </h1>

      <MobileHomePageFilter title={filterTitle}>
        <FiltersList menu={menu} {...data} />
      </MobileHomePageFilter>

      <div className="mt-5 hidden grow flex-col items-center gap-3 @md:flex-row md:flex">
        <FiltersList menu={menu} {...data} />
      </div>
    </>
  );
};

export const HomePageFiltersPlaceholder = () => {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
        {filterTitle || 'Find Your Part'}
      </h1>
      <div className="mt-5 flex w-full flex-col items-center gap-3 md:flex-row">
        <div className="h-9 w-full rounded bg-gray-50 opacity-50" />
        <div className="h-9 w-full rounded bg-gray-50 opacity-50" />
        <div className="h-9 w-full rounded bg-gray-50 opacity-50" />
        <div className="h-9 w-full rounded bg-gray-50 opacity-50" />
        <div className="h-9 w-full rounded bg-gray-50 opacity-50" />
      </div>
    </>
  );
};

export default HomePageFilters;
