'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import FiltersDialog from './dialog';

type MobileHomePageFilterProps = {
  children: React.ReactNode;
  title?: string;
};

const MobileHomePageFilter = ({ title, children }: MobileHomePageFilterProps) => {
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <button
        className="relative mt-5 flex w-3/5 grow flex-col items-center gap-3 md:hidden"
        onClick={openDialog}
      >
        <div className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-1.5 text-base text-gray-600">
          Select Part Type
          <ChevronDownIcon className="size-5 fill-black/60" />
        </div>
        <div className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-1.5 text-base text-gray-600 opacity-50">
          Select Make
          <ChevronDownIcon className="size-5 fill-black/60" />
        </div>
        <div className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-1.5 text-base text-gray-600 opacity-50">
          Select Model
          <ChevronDownIcon className="size-5 fill-black/60" />
        </div>
        <div className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-1.5 text-base text-gray-600 opacity-50">
          Select Year
          <ChevronDownIcon className="size-5 fill-black/60" />
        </div>
        <div className="w-full rounded bg-secondary px-4 py-2 text-sm font-medium text-white opacity-50">
          Search
        </div>
      </button>
      <FiltersDialog title={title} closeDialog={closeDialog} open={open}>
        {children}
      </FiltersDialog>
    </>
  );
};

export default MobileHomePageFilter;
