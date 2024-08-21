'use client';

import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import Price from 'components/price';
import { ReactNode, useState } from 'react';

const options = ['Included', 'Premium Labor', '+1 Year'] as const;
type Option = (typeof options)[number];

const formatWarrantyYears = (years: string) => {
  const yearsNum = parseFloat(years);
  if (yearsNum === 1.5) {
    return '18-Month';
  } else if (yearsNum === 1) {
    return '12-Month';
  } else {
    return `${yearsNum}-Year`;
  }
};

const WarrantySelector = ({ years }: { years: string }) => {
  const [selectedOptions, setSelectedOptions] = useState<Option>('Included');

  const plans: Array<{
    key: Option;
    template: ReactNode;
    price: number;
  }> = [
    {
      template: <span>{`${formatWarrantyYears(years)} Warranty`}</span>,
      price: 0,
      key: 'Included'
    }
  ];

  return (
    <RadioGroup value={selectedOptions} onChange={setSelectedOptions} className="space-y-2">
      {plans.map((option) => (
        <Field key={option.key} className="flex w-full items-center gap-2">
          <Radio
            value={option.key}
            className="group flex size-4 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary"
          >
            <span className="invisible size-1.5 rounded-full bg-white group-data-[checked]:visible" />
          </Radio>
          <Label className="flex text-sm">
            <span className="mr-1">{option.template}</span>
            (<Price amount={option.price.toString()} currencyCode="USD" />)
          </Label>
        </Field>
      ))}
    </RadioGroup>
  );
};

export default WarrantySelector;
