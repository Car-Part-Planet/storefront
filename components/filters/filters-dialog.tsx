'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { YEAR_FILTER_ID } from 'lib/constants';
import { toShopifyId } from 'lib/utils';
import { FilterOption } from 'lib/vercel-kv/types';
import { useParams, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';

type FiltersDialogProps = {
  makes: FilterOption[];
  models: FilterOption[];
  years: FilterOption[];
  partTypes: FilterOption[];
  children: React.ReactNode;
  title?: string;
};

const FiltersDialog = ({
  partTypes,
  children,
  years,
  makes,
  models,
  title
}: FiltersDialogProps) => {
  const params = useParams<{ collection?: string }>();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const yearIdFromSearchParams = searchParams.get(YEAR_FILTER_ID);
  const partTypeCollection = params.collection;
  const yearIdRef = useRef(yearIdFromSearchParams);

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
  return (
    <>
      <div className="flex w-full justify-center border-b border-t py-2 sm:border-t-0">
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <span className="font-semibold">{partType?.label}</span>
          {!shouldHideYMMRow && (
            <div className="flex items-center space-x-2 divide-x px-2">
              <span className="text-sm">{selectedMake?.label}</span>
              <span className="pl-2 text-sm">{selectedModel?.label}</span>
              <span className="pl-2 text-sm">{selectedYear?.label}</span>
              <button
                className="ml-3 rounded-full border p-1 text-center"
                onClick={() => setOpen(true)}
              >
                <ChevronDownIcon className="size-4" />
              </button>
            </div>
          )}
        </div>
        {shouldHideYMMRow && (
          <button className="ml-2 p-1 text-center" onClick={() => setOpen(true)}>
            <ChevronDownIcon className="size-4" />
          </button>
        )}
      </div>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 -translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-full"
            >
              <div className="flex h-auto w-full bg-white p-5">
                <DialogPanel className="w-full transform overflow-hidden text-left align-middle transition-all">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <DialogTitle className="flex grow justify-center text-base font-semibold leading-6 text-gray-900">
                        {title}
                      </DialogTitle>
                      <div className="ml-auto flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-1" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-y-3 px-4 sm:px-6">{children}</div>
                  </div>
                </DialogPanel>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FiltersDialog;
