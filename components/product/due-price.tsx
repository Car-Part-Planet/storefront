/* eslint-disable react/display-name */
import clsx from 'clsx';
import Price from 'components/price';
import { forwardRef } from 'react';

const DuePrice = forwardRef<
  HTMLDivElement,
  {
    price: string;
    currencyCode: string;
    direction: 'horizontal' | 'vertical';
  }
>(({ price, currencyCode, direction }, ref) => {
  return (
    <div
      className={clsx('flex', {
        'flex-col items-start justify-start': direction === 'vertical',
        'flex-row items-center justify-between': direction === 'horizontal'
      })}
      ref={ref}
    >
      <span
        className={clsx('font-semibold', {
          'text-sm': direction === 'vertical',
          'text-base': direction === 'horizontal'
        })}
      >
        Due Today
      </span>
      <Price
        amount={price}
        currencyCode={currencyCode}
        className="font-semibold text-emerald-500"
      />
    </div>
  );
});

export default DuePrice;
