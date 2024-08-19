'use client';

import { PhoneIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { phoneNumber } from 'lib/constants';
import { usePathname } from 'next/navigation';
import { Button } from './ui';

const PhoneButton = () => {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith('/product/');

  if (!phoneNumber) {
    return null;
  }

  return (
    <div
      className={clsx('fixed right-6 block md:hidden', {
        'bottom-24': isProductPage,
        'bottom-6': !isProductPage
      })}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>

      <a href={phoneNumber.link}>
        <Button
          variant="solid"
          color="primary"
          className="h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <PhoneIcon className="h-6 w-6" />
          <span className="sr-only">Call</span>
        </Button>
      </a>
    </div>
  );
};

export default PhoneButton;
