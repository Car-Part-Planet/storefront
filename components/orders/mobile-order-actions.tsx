'use client';

import dynamic from 'next/dynamic';
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { CoreReturnStatus, Order, WarrantyStatus } from 'lib/shopify/types';
import { isBeforeToday } from 'lib/utils';
import Link from 'next/link';
import { useState } from 'react';

const ActivateWarrantyModal = dynamic(() => import('./activate-warranty-modal'));
const OrderConfirmationModal = dynamic(() => import('./order-confirmation-modal'));
const CoreReturnModal = dynamic(() => import('./core-return-modal'));

const MobileOrderActions = ({ order }: { order: Order }) => {
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isOrderConfirmaionOpen, setIsOrderConfirmationOpen] = useState(false);
  const [isCoreReturnOpen, setIsCoreReturnOpen] = useState(false);

  const isWarrantyActivationAvailable =
    Boolean(order?.warrantyActivationDeadline) &&
    order?.warrantyStatus?.value === WarrantyStatus.NotActivated;

  const isCoreReturnNeeded =
    !!order?.coreReturnDeadline?.value &&
    order?.coreReturnStatus?.value === CoreReturnStatus.CoreNeeded;

  const isPastWarrantyActivationDeadline = isBeforeToday(order?.warrantyActivationDeadline?.value);
  const isPastCoreReturnDeadline = isBeforeToday(order?.coreReturnDeadline?.value);
  const isOrderConfirmed = order?.orderConfirmation?.value;

  return (
    <>
      <Menu as="div" className="relative flex justify-end lg:hidden">
        <div className="flex items-center">
          <MenuButton className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Options for order {order.name}</span>
            <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <Link
                  href={`/account/orders/${order.normalizedId}`}
                  className={clsx(
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  View
                </Link>
              )}
            </MenuItem>
            {!isOrderConfirmed && (
              <MenuItem>
                {({ focus }) => (
                  <Button
                    className={clsx(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'flex w-full px-4 py-2 text-sm'
                    )}
                    onClick={() => setIsOrderConfirmationOpen(true)}
                  >
                    Confirm Order
                  </Button>
                )}
              </MenuItem>
            )}
            {isWarrantyActivationAvailable && !isPastWarrantyActivationDeadline && (
              <MenuItem>
                {({ focus }) => (
                  <Button
                    className={clsx(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'flex w-full px-4 py-2 text-sm'
                    )}
                    onClick={() => setIsWarrantyOpen(true)}
                  >
                    Activate Warranty
                  </Button>
                )}
              </MenuItem>
            )}
            {isCoreReturnNeeded && !isPastCoreReturnDeadline && (
              <MenuItem>
                {({ focus }) => (
                  <Button
                    className={clsx(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'flex w-full px-4 py-2 text-sm'
                    )}
                    onClick={() => setIsCoreReturnOpen(true)}
                  >
                    Core Return
                  </Button>
                )}
              </MenuItem>
            )}
          </div>
        </MenuItems>
      </Menu>
      {isWarrantyOpen && (
        <ActivateWarrantyModal
          isOpen={isWarrantyOpen}
          onClose={() => setIsWarrantyOpen(false)}
          order={order}
        />
      )}
      {isOrderConfirmaionOpen && (
        <OrderConfirmationModal
          isOpen={isOrderConfirmaionOpen}
          onClose={() => setIsOrderConfirmationOpen(false)}
          order={order}
        />
      )}
      {isCoreReturnOpen && (
        <CoreReturnModal
          isOpen={isCoreReturnOpen}
          onClose={() => setIsCoreReturnOpen(false)}
          order={order}
        />
      )}
    </>
  );
};

export default MobileOrderActions;
