'use client';

import { TruckIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import SideDialog from 'components/side-dialog';
import { useProduct, useUpdateURL } from 'context/product-context';
import { DELIVERY_OPTION_KEY } from 'lib/constants';
import { cn } from 'lib/utils';
import { ReactNode, useEffect, useState, useTransition } from 'react';

const options = ['Commercial', 'Residential'] as const;

type Option = (typeof options)[number];

export const getDeliveryOptions = (
  commercialPrice: number,
  residentialPrice: number
): Array<{
  key: Option;
  template: ReactNode;
  price: number;
}> => [
  {
    template: <span className="font-bold">Commercial</span>,
    price: commercialPrice,
    key: 'Commercial' as Option
  },
  {
    template: <span className="font-bold">Residential</span>,
    price: residentialPrice,
    key: 'Residential' as Option
  }
];

const Delivery = ({
  storePrefix,
  siteName,
  phoneBlock
}: {
  storePrefix: string | undefined;
  siteName: string | undefined;
  phoneBlock: ReactNode;
}) => {
  const { state, updateOption } = useProduct();
  const updateUrl = useUpdateURL();
  const [, startTransition] = useTransition();

  const [openingDialog, setOpeningDialog] = useState<'information' | 'terms-conditions' | null>(
    null
  );

  const handleSelectDelivery = (option: Option) => {
    startTransition(() => {
      const newState = updateOption(DELIVERY_OPTION_KEY, option);
      updateUrl(newState);
    });
  };

  const selectedDeliveryOption = state[DELIVERY_OPTION_KEY];
  useEffect(() => {
    if (!selectedDeliveryOption) {
      handleSelectDelivery(options[0]);
    }
  }, [selectedDeliveryOption]);

  // Conditional price values based on storePrefix
  const commercialPrice = storePrefix === 'reman-transmission' ? 299 : 0;
  const residentialPrice = storePrefix === 'reman-transmission' ? 398 : 99;

  const deliveryOptions = getDeliveryOptions(commercialPrice, residentialPrice);

  return (
    <div className="flex flex-col text-xs lg:text-sm">
      <div className="mb-3 flex flex-row items-center space-x-1 divide-x divide-gray-400 leading-none lg:space-x-3">
        <div className="flex flex-row items-center space-x-2 text-base font-medium">
          <TruckIcon className="h-5 w-5" />
          <span>Delivery</span>
        </div>
        <div className="pl-2">
          <button
            onClick={() => setOpeningDialog('information')}
            className="text-xs text-blue-800 hover:underline lg:text-sm"
          >
            Shipping Policy
          </button>
          <SideDialog
            title="Shipping Policy"
            onClose={() => setOpeningDialog(null)}
            open={openingDialog === 'information'}
          >
            <div className="mt-5 flex h-full flex-col space-y-3 overflow-y-auto">
              <section>
                {storePrefix === 'reman-transmission' ? (
                  <>
                    <p className="text-md mb-3 font-semibold">
                      Flat Rate Shipping to Commercial Addresses
                    </p>
                    <p className="mb-2 text-sm">
                      We offer Flat Rate Shipping of $299.00 if you are shipping to a commercial
                      address. This means the address you are shipping to is in a commercially zoned
                      location.
                    </p>
                    <p className="mb-2 text-sm">
                      Home businesses do not count as a commercial address. Please ship directly to
                      your repair shop or dealership performing repairs to utilize our Flat Rate
                      Shipping to Commercial Addresses option.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-md mb-3 font-semibold">
                      Free Shipping to Commercial Addresses
                    </p>
                    <p className="mb-2 text-sm">
                      We offer Free Shipping if you are shipping to a commercial address. This means
                      the address you are shipping to is in a commercially zoned location.
                    </p>
                    <p className="mb-2 text-sm">
                      Home businesses do not count as a commercial address. Please ship directly to
                      your repair shop or dealership performing repairs to utilize our Free Shipping
                      to Commercial Addresses option.
                    </p>
                  </>
                )}
              </section>

              <section>
                <p className="text-md mb-2 font-semibold">Residential Address / Liftgate Fee</p>
                <p className="mb-2 text-sm">
                  If you are shipping to a residential address, there will be a surcharge of $99.00
                  to accomodate the need for a liftgate-based delivery.
                </p>
                <p className="mb-2 text-sm">
                  Please make sure your address location is capable of receiving freight without the
                  need of prior notification or appointment setup and capability of unloading with
                  forklift from the delivery truck.
                </p>
                <p className="text-sm">
                  Please note, certain locations (remote areas) as well as certain locations in CO,
                  UT, MT, NY, OR, CA may result in additional delivery fees.
                </p>
              </section>

              <section>
                <p className="text-md mb-2 font-semibold">Delivery Times</p>
                <p className="text-sm">
                  Under normal circumstances you will receive your order within 7-14 Business Days
                  (excluding weekends and holidays). However, due to increased order volumes,
                  weather conditions, or circumstances beyond our control, we will ship your order
                  out as soon as possible. Please note all shipping times are estimates and not
                  guarantees. ${siteName} will not be responsible for any additional fees that the
                  carrier may charge due to re-delivery or storage.
                </p>
              </section>

              <section>
                <p className="text-md mb-2 font-semibold">Damaged Parts</p>
                <p className="text-sm">
                  All engines are inspected before shipping to purchaser. However, damage may occur
                  during shipping. We request that customers inspect all engines and transmissions
                  at the time of delivery for any damage. Report damaged, wrong, or missing parts
                  before signing any shipping documents. Damaged, wrong, or missing parts should be
                  reported by the purchaser at the time of delivery. Failure to report damages
                  before signing shipping documents, places responsibility on purchaser (receiver).
                  Purchaser refers to any representative of the company designated to sign for
                  delivery.
                </p>
              </section>

              <section>{phoneBlock}</section>
            </div>
          </SideDialog>
        </div>
      </div>
      <ul className="flex min-h-16 flex-row space-x-4 pt-2">
        {deliveryOptions.map((option) => (
          <li className="flex w-32" key={option.key}>
            <button
              onClick={() => handleSelectDelivery(option.key)}
              className={cn(
                'font-base flex w-full flex-col flex-wrap items-center justify-center space-y-0.5 rounded border text-center text-xs',
                {
                  'border-0 ring-2 ring-secondary': selectedDeliveryOption === option.key
                }
              )}
            >
              {option.template}
              <Price amount={String(option.price)} currencyCode="USD" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Delivery;
