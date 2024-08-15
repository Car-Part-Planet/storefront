import clsx from 'clsx';
import Price from 'components/price';

const DuePrice = ({
  price,
  currencyCode,
  direction
}: {
  price: string;
  currencyCode: string;
  direction: 'horizontal' | 'vertical';
}) => {
  return (
    <div
      className={clsx('flex', {
        'flex-col items-start justify-start': direction === 'vertical',
        'flex-row items-center justify-between': direction === 'horizontal'
      })}
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
};

export default DuePrice;
