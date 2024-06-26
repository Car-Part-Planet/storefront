import { getMenu, getMetaobjects } from 'lib/shopify';
import { ReactNode } from 'react';
import FiltersList from './filters-list';

const YMMFiltersContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded border bg-white px-6 pb-5 pt-4 @container">
      <p className="mb-3 text-xl font-semibold leading-tight tracking-tight text-neutral-700">
        Find Your Car Part
      </p>
      {children}
    </div>
  );
};

const YMMFilters = async () => {
  const yearsData = getMetaobjects('make_model_year_composite');
  const modelsData = getMetaobjects('make_model_composite');
  const makesData = getMetaobjects('make');

  const [years, models, makes] = await Promise.all([yearsData, modelsData, makesData]);
  const menu = await getMenu('main-menu');

  return (
    <YMMFiltersContainer>
      <div className="flex grow flex-col items-center gap-3 @md:flex-row">
        <FiltersList years={years} makes={makes} models={models} menu={menu} />
      </div>
    </YMMFiltersContainer>
  );
};

export const YMMFiltersPlaceholder = () => {
  return (
    <YMMFiltersContainer>
      <div className="flex grow animate-pulse flex-col items-center gap-3 md:flex-row">
        <div className="h-9 w-full rounded bg-gray-100" />
        <div className="h-9 w-full rounded bg-gray-100" />
        <div className="h-9 w-full rounded bg-gray-100" />
      </div>
    </YMMFiltersContainer>
  );
};

export default YMMFilters;
