'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type AccordionDetailsProps = {
  defaultOpen?: boolean;
  title: string;
  children: React.ReactNode;
};

const AccordionDetails = ({ defaultOpen = true, title, children }: AccordionDetailsProps) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      <DisclosureButton className="group flex w-full items-center justify-between px-2 py-4">
        <h3 className="text-lg font-semibold leading-6 text-content-dark">{title}</h3>
        <ChevronDownIcon className="size-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel unmount={false} className="pb-5">
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default AccordionDetails;
