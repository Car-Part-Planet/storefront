'use client';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { YEAR_FILTER_ID } from 'lib/constants';
import { toShopifyId } from 'lib/utils';
import { FilterOption } from 'lib/vercel-kv/types';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import FiltersDialog from './dialog';

type FiltersDialogContainerProps = {
  children: React.ReactNode;
  title?: string;
  makes: FilterOption[];
  models: FilterOption[];
  years: FilterOption[];
  partTypes: FilterOption[];
};

const FiltersDialogContainer = ({
  children,
  title,
  makes,
  models,
  years,
  partTypes
}: FiltersDialogContainerProps) => {
  const searchParams = useSearchParams();
  const params = useParams<{ collection?: string }>();

  const [open, setOpen] = useState(false);

  const yearIdFromSearchParams = searchParams.get(YEAR_FILTER_ID);
  const yearIdRef = useRef(yearIdFromSearchParams);
  const partTypeCollection = params.collection;

  useEffect(() => {
    if (yearIdRef.current !== yearIdFromSearchParams) {
      setOpen(false);
      yearIdRef.current = yearIdFromSearchParams;
    }
  }, [yearIdFromSearchParams]);

  const partType = partTypes.find(
    (type) =>
      type.value === partTypeCollection ||
      (partTypeCollection && partTypeCollection.includes(type.value))
  );
  const selectedYear = years.find((year) => toShopifyId(year.value) === yearIdFromSearchParams);
  const [, make, model] = selectedYear?.parent?.split('_') || [];
  const selectedMake = makes.find((makeOption) => makeOption.label === make) || null;
  const selectedModel = models.find((modelOption) => modelOption.label === model) || null;

  const shouldHideYMMRow = !selectedMake && !selectedModel && !selectedYear;

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <button
        className="flex w-full justify-center border-b border-t py-2 sm:border-t-0"
        onClick={openDialog}
      >
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <span className="font-semibold">
            {shouldHideYMMRow ? 'Search Our Inventory' : partType?.label}
          </span>
          {!shouldHideYMMRow && (
            <div className="flex items-center space-x-2 divide-x px-2">
              <span className="text-sm">{selectedMake?.label}</span>
              <span className="pl-2 text-sm">{selectedModel?.label}</span>
              <span className="pl-2 text-sm">{selectedYear?.label}</span>
              <div className="ml-3 rounded-full border p-1 text-center">
                <ChevronDownIcon className="size-4" />
              </div>
            </div>
          )}
        </div>
        {shouldHideYMMRow && (
          <div className="ml-2 p-1 text-center">
            <ChevronDownIcon className="size-4" />
          </div>
        )}
      </button>
      <FiltersDialog title={title} closeDialog={closeDialog} open={open}>
        {children}
      </FiltersDialog>
    </>
  );
};

export default FiltersDialogContainer;
