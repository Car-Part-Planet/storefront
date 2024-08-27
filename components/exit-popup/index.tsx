'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { phoneNumberMap } from 'lib/constants';
import { useState } from 'react';
import { useExitIntent } from 'use-exit-intent';

const ExitPopup = () => {
  const [open, setOpen] = useState(false);
  const { registerHandler } = useExitIntent({
    desktop: {
      triggerOnIdle: false,
      delayInSecondsToTrigger: 8,
      triggerOnMouseLeave: true
    },
    mobile: {
      delayInSecondsToTrigger: 15,
      triggerOnIdle: true
    },
    cookie: {
      key: 'use-exit-intent'
    }
  });

  registerHandler({
    id: 'exit-popup',
    handler: () => setOpen(true)
  });

  const phoneNumber = process.env.NEXT_PUBLIC_STORE_PREFIX
    ? phoneNumberMap[process.env.NEXT_PUBLIC_STORE_PREFIX]
    : null;

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <PhoneIcon aria-hidden="true" className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Wait! Don&apos;t leave!
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Our inventory is changing daily. Call us if you need help locating your part.{' '}
                    <span className="text-primary"> {phoneNumber ? phoneNumber.title : ''}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <a
                className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href={phoneNumber ? phoneNumber.link : '#'}
              >
                Call Us
              </a>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ExitPopup;
