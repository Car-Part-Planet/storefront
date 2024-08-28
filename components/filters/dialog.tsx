'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

type FiltersDialogProps = {
  children: React.ReactNode;
  title?: string;
  closeDialog: () => void;
  open: boolean;
};

const FiltersDialog = ({ children, title, closeDialog, open }: FiltersDialogProps) => {
  return (
    <Dialog open={open} onClose={closeDialog} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          >
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
              <div className="mt-6 flex flex-col gap-y-3 px-4">{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default FiltersDialog;
