'use client';

import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import Price from 'components/price';
import SideDialog from 'components/side-dialog';
import { useProduct, useUpdateURL } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER } from 'lib/constants';
import { CoreChargeOption } from 'lib/shopify/types';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coreChargeOptions, coreVariantIdSearchParam]);

  const openDialog = () => setIsOpenDialog(true);
  const closeDialog = () => setIsOpenDialog(false);

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-row items-center justify-between leading-none">
        <span className="text-sm font-medium"> Core charge </span>
        <button className="text-xs text-blue-700 underline" onClick={openDialog}>
          How does it work?
        </button>

        <SideDialog title="Core Charges and Returns" onClose={closeDialog} open={isOpenDialog}>
          {children}
        </SideDialog>
      </div>
      {coreChargeOptions.length > 0 ? (
        <RadioGroup
          value={coreVariantIdSearchParam}
          onChange={handleSelectCoreChargeOption}
          className="space-y-2"
        >
          {coreChargeOptions.map((option) => (
            <Field key={option.value} className="flex w-full items-center gap-2">
              <Radio
                value={option.value}
                className="group flex size-4 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary"
              >
                <span className="invisible size-1.5 rounded-full bg-white group-data-[checked]:visible" />
              </Radio>
              <Label className="flex text-sm">
                <span className="mr-1">{option.label}</span>
                (<Price {...option.price} />)
              </Label>
            </Field>
          ))}
        </RadioGroup>
      ) : (
        <RadioGroup value="0" disabled>
          <Field className="flex w-full items-center gap-2">
            <Radio
              value="0"
              className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary data-[disabled]:bg-gray-100"
            >
              <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
            </Radio>
            <Label className="flex data-[disabled]:opacity-50">
              <span className="mr-1">Not Required</span>
              ( <Price amount={'0'} currencyCode="USD" />)
            </Label>
          </Field>
        </RadioGroup>
      )}
    </div>
  );
};

export default CoreCharge;
