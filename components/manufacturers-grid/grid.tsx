import { GlobeAltIcon, StarIcon } from '@heroicons/react/24/outline';
import { Metaobject } from 'lib/shopify/types';
import kebabCase from 'lodash.kebabcase';
import ButtonGroup from './button-group';
import ManufacturerItem from './item';

type ManufacturersGridProps = {
  manufacturers: Metaobject[];
  variant?: 'engines' | 'transmissions' | 'home' | 'remanufactured-engines' | 'transfer-cases';
};

const ManufacturersGrid = ({ manufacturers, variant = 'home' }: ManufacturersGridProps) => {
  const popularManufacturers = manufacturers.filter(
    (manufacturer) => manufacturer.is_popular === 'true'
  );

  return (
    <div className="h-auto w-full overflow-auto rounded px-10 py-6 shadow lg:max-h-[700px]">
      {popularManufacturers.length ? (
        <>
          <p className="flex items-center gap-2">
            <StarIcon className="size-4" />
            <span className="font-medium text-blue-800">Popular Manufacturers</span>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-5 md:grid-cols-3 md:gap-y-8 lg:grid-cols-4 xl:grid-cols-5">
            {popularManufacturers.map((manufacturer, index) => (
              <div key={manufacturer.id} className="flex flex-col gap-2">
                {variant === 'home' ? (
                  <ManufacturerItem manufacturer={manufacturer} />
                ) : (
                  <ManufacturerItem
                    manufacturer={manufacturer}
                    className="rounded border border-primary px-2 py-1"
                    href={`/${variant}/${kebabCase(manufacturer.name)}`}
                    prefetch={index < 5}
                  />
                )}
                {variant === 'home' && (
                  <ButtonGroup manufacturer={manufacturer} prefetch={index < 5} />
                )}
              </div>
            ))}
          </div>
          <hr className="my-10 w-full" />
        </>
      ) : null}

      <p className="flex items-center gap-2">
        <GlobeAltIcon className="size-4" />
        <span className="font-medium text-blue-800">All Manufacturers</span>
      </p>
      <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-5 md:grid-cols-3 md:gap-y-8 lg:grid-cols-4 xl:grid-cols-5">
        {manufacturers
          .toSorted((a, b) => a.display_name!.localeCompare(b.display_name!))
          .map((manufacturer) => (
            <div key={manufacturer.id} className="flex flex-col gap-2">
              {variant === 'home' ? (
                <ManufacturerItem manufacturer={manufacturer} />
              ) : (
                <ManufacturerItem
                  manufacturer={manufacturer}
                  className="rounded border border-primary px-2 py-1"
                  href={`/${variant}/${kebabCase(manufacturer.name)}`}
                  prefetch={false}
                />
              )}
              {variant === 'home' && <ButtonGroup manufacturer={manufacturer} prefetch={false} />}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManufacturersGrid;
