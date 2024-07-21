import { filterTitle } from 'lib/constants';
import { getMenu } from 'lib/shopify';
import FiltersDialog from './filters-dialog';
import FiltersList from './filters-list';
import { loadMMMYFilters } from './utils';

const MobileMMYFilters = async () => {
  const data = await loadMMMYFilters();
  const menu = await getMenu('main-menu');

  return (
    <FiltersDialog title={filterTitle} {...data}>
      <FiltersList {...data} menu={menu} />
    </FiltersDialog>
  );
};

export const MobileMMYFiltersPlaceholder = () => {
  return (
    <div className="flex w-full justify-center border-b border-t py-2 sm:border-t-0">
      <div className="flex animate-pulse flex-col items-center justify-center space-y-0.5">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="flex items-center space-x-2 divide-x px-2">
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="h-4 w-12 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default MobileMMYFilters;
