'use client';

import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import SideDialog from 'components/side-dialog';
import { useProduct, useUpdateURL } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER } from 'lib/constants';
import { CoreChargeOption } from 'lib/shopify/types';
import { cn } from 'lib/utils';
import { ReactNode, useEffect, useState, useTransition } from 'react';

type CoreChargeProps = {
  children: ReactNode;
};

const CoreCharge = ({ children }: CoreChargeProps) => {
  const { variant, updateOption, state } = useProduct();
  const updateUrl = useUpdateURL();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const coreVariantIdSearchParam = state[CORE_VARIANT_ID_KEY];
  const [, startTransition] = useTransition();

  const { coreCharge, waiverAvailable, coreVariantId } = variant ?? {};

  const handleSelectCoreChargeOption = (coreVariantId: string) => {
    startTransition(() => {
      const newState = updateOption(CORE_VARIANT_ID_KEY, coreVariantId);
      updateUrl(newState);
    });
  };

  const coreChargeOptions = [
    waiverAvailable && {
      label: 'Waive Core',
      value: CORE_WAIVER,
      price: { amount: 0, currencyCode: variant?.price.currencyCode }
    },
    coreVariantId &&
      coreCharge && {
        label: 'Fully Refundable',
        value: coreVariantId,
        price: coreCharge
      }
  ].filter(Boolean) as CoreChargeOption[];

  useEffect(() => {
    if (!coreVariantIdSearchParam && coreChargeOptions.length > 0) {
      handleSelectCoreChargeOption((coreChargeOptions[0] as CoreChargeOption).value);
    }
  }, [coreChargeOptions, coreVariantIdSearchParam]);

  const openDialog = () => setIsOpenDialog(true);
  const closeDialog = () => setIsOpenDialog(false);

  return (
    <div className="flex flex-col text-xs lg:text-sm">
      <div className="mb-1 flex flex-row items-center space-x-1 divide-x divide-gray-400 leading-none lg:space-x-3">
        <div className="flex flex-row items-center space-x-2 text-base font-medium">
          <ArrowPathRoundedSquareIcon className="h-5 w-5" />
          <span> Core charge </span>
        </div>
        <button className="pl-2 text-blue-800 hover:underline" onClick={openDialog}>
          How does the core charge work?
        </button>

        <SideDialog title="Core Charges and Returns" onClose={closeDialog} open={isOpenDialog}>
          {children}
        </SideDialog>
      </div>
      <ul className="flex min-h-16 flex-row space-x-4 pt-2">
        {coreChargeOptions.length > 0 ? (
          coreChargeOptions.map((option) => (
            <li className="flex w-32" key={option.value}>
              <button
                onClick={() => handleSelectCoreChargeOption(option.value)}
                className={cn(
                  'font-base flex w-full flex-col flex-wrap items-center justify-center space-y-0.5 rounded border text-center text-xs',
                  {
                    'border-0 ring-2 ring-secondary': coreVariantIdSearchParam === option.value
                  }
                )}
              >
                <span className="font-bold">{option.label}</span>
                <Price {...option.price} />
              </button>
            </li>
          ))
        ) : (
          <li className="flex w-32">
            <button
              className={cn(
                'font-base flex w-full flex-col flex-wrap items-center justify-center space-y-0.5 rounded border text-center text-xs',
                'cursor-not-allowed border-0 opacity-50 ring-2 ring-secondary'
              )}
              disabled
            >
              <span className="font-bold">Not Required</span>
              <Price amount={'0'} currencyCode="USD" />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CoreCharge;
