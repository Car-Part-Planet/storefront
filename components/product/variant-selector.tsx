'use client';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Price from 'components/price';
import { useProduct, useUpdateURL } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER } from 'lib/constants';
import { CoreChargeOption, Money, ProductOption, ProductVariant } from 'lib/shopify/types';
import { findVariantWithMinPrice, formatNumber } from 'lib/utils';
import startCase from 'lodash.startcase';
import { Fragment, useState } from 'react';
import EmptyVariant from './empty-variants';

export type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

export function VariantSelector({
  options,
  variants,
  minPrice,
  condition,
  combinations
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  minPrice: Money;
  condition: 'remanufactured' | 'used';
  combinations: Combination[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, updateOptions } = useProduct();
  const updateURL = useUpdateURL();

  const variantWithMinPrice = findVariantWithMinPrice(variants);
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const numberOfVariants = variants.filter(({ availableForSale }) => availableForSale).length;

  if (numberOfVariants === 0) {
    return <EmptyVariant condition={condition} />;
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
    <>
      <button
        className="flex flex-row items-center gap-1 rounded-lg bg-gray-100 px-4 py-3 text-sm hover:bg-gray-200"
        aria-label="Open variants selector"
        onClick={openModal}
      >
        <span>
          {numberOfVariants} {condition} {numberOfVariants > 1 ? 'options' : 'option'}
        </span>
        <span>from</span>
        <Price amount={updatedMinPrice.amount} currencyCode={updatedMinPrice.currencyCode} />
        <ChevronRightIcon className="ml-2 size-4 text-gray-700" />
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
                <p className="text-lg font-semibold">{startCase(condition)} Options</p>

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

                          if (!variant) {
                            return null;
                          }

                          const coreChargeOptions = [
                            variant.waiverAvailable && {
                              label: 'Core Waiver',
                              value: CORE_WAIVER,
                              price: { amount: 0, currencyCode: variant?.price.currencyCode }
                            },
                            variant.coreVariantId &&
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
                          const estimatedDelivery =
                            condition === 'used' ? '7-10 Business Days' : variant.estimatedDelivery;

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
                                    <Price
                                      amount={variant.price.amount}
                                      currencyCode={variant.price.currencyCode}
                                      className="text-base font-semibold"
                                    />
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-medium text-gray-600">
                                        SKU:
                                      </span>
                                      <span className="text-xs text-gray-600">{variant.sku}</span>
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
                                    <span>{variant.condition || 'N/A'}</span>
                                  </div>
                                  {estimatedDelivery ? (
                                    <div className="flex flex-row items-center gap-2">
                                      <span>Estimated Delivery:</span>
                                      <span>{estimatedDelivery}</span>
                                    </div>
                                  ) : null}

                                  <div className="flex flex-row items-center gap-2">
                                    <span>Mileage:</span>
                                    <span>
                                      {variant.mileage
                                        ? formatNumber(Number(variant.mileage))
                                        : '0 miles'}
                                    </span>
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
    </>
  );
}
