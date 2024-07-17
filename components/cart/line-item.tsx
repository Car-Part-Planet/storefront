/* eslint-disable @next/next/no-img-element */
import { PlusIcon } from '@heroicons/react/16/solid';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { CartItem } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';

type LineItemProps = {
  item: CartItem;
};

type MerchandiseSearchParams = {
  [key: string]: string;
};

const CoreCharge = ({ coreCharge, quantity }: { coreCharge?: CartItem; quantity: number }) => {
  if (!coreCharge) return null;

  return (
    <div className="flex flex-row items-center">
      <PlusIcon className="mr-1.5 size-3" />
      <div className="flex flex-row items-center justify-start gap-2">
        {coreCharge.merchandise.selectedOptions[0] ? (
          <Price
            className="text-xs font-medium"
            amount={coreCharge.merchandise.selectedOptions[0].value}
            currencyCode="USD"
          />
        ) : (
          <span>Included</span>
        )}
        <span className="text-xs font-medium text-gray-700">{`x ${quantity}`}</span>
        <div className="ml-0.5 text-xs font-medium text-neutral-500">(Core Charge)</div>
      </div>
    </div>
  );
};
const LineItem = ({ item }: LineItemProps) => {
  const merchandiseSearchParams = {} as MerchandiseSearchParams;

  item.merchandise.selectedOptions.forEach(({ name, value }) => {
    if (value !== DEFAULT_OPTION) {
      merchandiseSearchParams[name.toLowerCase()] = value;
    }
  });

  const merchandiseUrl = createUrl(
    `/product/${item.merchandise.product.handle}`,
    new URLSearchParams(merchandiseSearchParams)
  );

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          alt={item.merchandise.product?.featuredImage?.altText || item.merchandise.product.title}
          src={item.merchandise.product?.featuredImage?.url}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-6">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link
                  href={merchandiseUrl}
                  className="font-medium text-gray-700 hover:text-gray-800"
                >
                  {item.merchandise.product.title}
                </Link>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              {item.merchandise.title !== DEFAULT_OPTION ? (
                <p className="text-gray-500">{item.merchandise.title}</p>
              ) : null}
            </div>
            <div className="mt-1 flex w-full flex-wrap items-center gap-3">
              <Price
                className="text-sm font-medium text-gray-900"
                amount={item.cost.totalAmount.amount}
                currencyCode={item.cost.totalAmount.currencyCode}
              />
              <CoreCharge coreCharge={item.coreCharge} quantity={item.quantity} />
            </div>
            <div className="mt-4 flex h-9 w-fit flex-row items-center rounded-sm border border-neutral-300 dark:border-neutral-700">
              <EditItemQuantityButton item={item} type="minus" />
              <p className="w-6 text-center">
                <span className="w-full text-sm">{item.quantity}</span>
              </p>
              <EditItemQuantityButton item={item} type="plus" />
            </div>
          </div>

          <div className="absolute right-0 top-0">
            <div className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
              <DeleteItemButton item={item} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default LineItem;
