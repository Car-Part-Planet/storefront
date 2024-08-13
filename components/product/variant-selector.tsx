'use client';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Price from 'components/price';
import { useProduct, useUpdateURL } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER } from 'lib/constants';
import { CoreChargeOption, Money, ProductOption, ProductVariant } from 'lib/shopify/types';
import { findVariantWithMinPrice } from 'lib/utils';
import { Fragment, useEffect, useState, useTransition } from 'react';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

export function VariantSelector({
  options,
  variants,
  minPrice
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  minPrice: Money;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, updateOptions } = useProduct();
  const updateURL = useUpdateURL();
  const [, startTransition] = useTransition();

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  const variantWithMinPrice = findVariantWithMinPrice(variants);

  // If a variant is not selected, we want to select the first available for sale variant as default
  useEffect(() => {
    const hasSelectedVariant = Object.entries(state).some(([key, value]) => {
      return combinations.some((combination) => combination[key] === value);
    });

    if (!hasSelectedVariant) {
      const defaultVariant =
        variantWithMinPrice || variants.find((variant) => variant.availableForSale);
      if (defaultVariant) {
        startTransition(() => {
          const newState = updateOptions(
            defaultVariant.selectedOptions.map((option) => ({
              name: option.name.toLowerCase(),
              value: option.value
            }))
          );

          updateURL(newState);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinations, variantWithMinPrice, variants]);

  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const currencyCode = variants[0]?.price.currencyCode || 'USD';
  const variantsById: Record<string, ProductVariant> = variants.reduce((acc, variant) => {
    return { ...acc, [variant.id]: variant };
  }, {});

  const updatedMinPrice = {
    amount: variantWithMinPrice ? String(variantWithMinPrice.price.amount) : minPrice.amount,
    currencyCode: currencyCode
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="mb-6 flex flex-col gap-1 rounded-md border p-2 text-sm font-medium sm:flex-row">
      <span>See more Remanufactured and Used Options</span>
      <button
        className="flex flex-row gap-0.5 font-normal text-blue-800 hover:underline"
        aria-label="Open variants selector"
        onClick={openModal}
      >
        <span className="sm:hidden">from</span>
        <span className="hidden sm:inline"> from </span>
        <Price amount={updatedMinPrice.amount} currencyCode={updatedMinPrice.currencyCode} />
      </button>
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeModal} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[500px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Remanufactured & Used Options</p>

                <button aria-label="Close cart" onClick={closeModal} className="text-black">
                  <XMarkIcon className="h-6" />
                </button>
              </div>
              <div className="mt-5 flex h-full flex-col overflow-auto">
                {options.map((option) => {
                  return (
                    <form key={option.id}>
                      <ul className="flex-grow flex-col space-y-4 overflow-auto px-2 py-4">
                        {option.values.map((value) => {
                          const optionNameLowerCase = option.name.toLowerCase();
                          const optionParams = { ...state, [optionNameLowerCase]: value };
                          // Filter out invalid options and check if the option combination is available for sale.
                          const filtered = Object.entries(optionParams).filter(([key, value]) =>
                            options.find(
                              (option) =>
                                option.name.toLowerCase() === key && option.values.includes(value)
                            )
                          );

                          const isAvailableForSale = combinations.find((combination) =>
                            filtered.every(
                              ([key, value]) =>
                                combination[key] === value && combination.availableForSale
                            )
                          );

                          const variant = isAvailableForSale
                            ? variantsById[isAvailableForSale.id]
                            : undefined;

                          const coreChargeOptions = [
                            variant?.waiverAvailable && {
                              label: 'Core Waiver',
                              value: CORE_WAIVER,
                              price: { amount: 0, currencyCode: variant?.price.currencyCode }
                            },
                            variant?.coreVariantId &&
                              variant.coreCharge && {
                                label: 'Core Charge',
                                value: variant.coreVariantId,
                                price: variant.coreCharge
                              }
                          ].filter(Boolean) as CoreChargeOption[];

                          const stateToUpdate = [{ name: optionNameLowerCase, value }];

                          // preset the first core charge option if not set
                          if (coreChargeOptions[0]) {
                            stateToUpdate.push({
                              name: CORE_VARIANT_ID_KEY,
                              value: coreChargeOptions[0].value
                            });
                          }
                          // The option is active if it's in the url params.
                          const isActive = state[optionNameLowerCase] === value;
                          return (
                            <li
                              key={value}
                              className={clsx('flex w-full rounded border border-neutral-300', {
                                'cursor-default ring-2 ring-secondary': isActive,
                                'ring-2 ring-transparent hover:ring-secondary':
                                  !isActive && isAvailableForSale,
                                'cursor-not-allowed opacity-60 ring-1 ring-neutral-300':
                                  !isAvailableForSale
                              })}
                            >
                              <button
                                disabled={!isAvailableForSale}
                                aria-disabled={!isAvailableForSale}
                                formAction={() => {
                                  const newState = updateOptions(stateToUpdate);
                                  updateURL(newState);
                                  closeModal();
                                }}
                                className="flex w-full flex-col gap-2 px-4 py-3"
                              >
                                <div className="flex w-full flex-row items-center justify-between">
                                  <div className="flex flex-col items-start gap-1">
                                    {variant ? (
                                      <Price
                                        amount={variant.price.amount}
                                        currencyCode={variant.price.currencyCode}
                                        className="text-base font-semibold"
                                      />
                                    ) : null}
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-medium text-gray-600">
                                        SKU:
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {variant?.sku || 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                  {!isAvailableForSale ? (
                                    <span>Call for additional availability</span>
                                  ) : null}
                                </div>
                                <div className="mt-1.5 flex flex-row flex-wrap items-center gap-3">
                                  {coreChargeOptions.map((option) => (
                                    <div
                                      key={option.value}
                                      className={
                                        'flex flex-row items-center gap-2 rounded-full border border-neutral-300 bg-transparent px-3 py-1 text-xs'
                                      }
                                    >
                                      <span>{option.label}</span>
                                      <Price {...option.price} />
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 flex w-full flex-col gap-1 border-t border-gray-300 pl-1 pt-2 text-xs tracking-normal">
                                  <div className="flex flex-row items-center gap-2">
                                    <span>Condition:</span>
                                    <span>{variant?.condition || 'N/A'}</span>
                                  </div>
                                  <div className="flex flex-row items-center gap-2">
                                    <span>Estimated Delivery:</span>
                                    <span>{variant?.estimatedDelivery || 'N/A'}</span>
                                  </div>
                                  <div className="flex flex-row items-center gap-2">
                                    <span>Mileage:</span>
                                    <span>{variant?.mileage || 'N/A'}</span>
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </form>
                  );
                })}
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  );
}
