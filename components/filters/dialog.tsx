'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';

type FiltersDialogProps = {
  children: React.ReactNode;
  title?: string;
  closeDialog: () => void;
  open: boolean;
};

const FiltersDialog = ({ children, title, closeDialog, open }: FiltersDialogProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeDialog}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 -translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-full"
          >
            <div className="flex h-auto w-full bg-white p-5">
              <DialogPanel className="w-full transform overflow-hidden text-left align-middle transition-all">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <DialogTitle className="flex grow justify-center text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </DialogTitle>
                    <div className="ml-auto flex h-7 items-center">
                      <button
                        type="button"
                        onClick={closeDialog}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-1" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-y-3 px-4 sm:px-6">{children}</div>
                </div>
              </DialogPanel>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FiltersDialog;
