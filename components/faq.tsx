/* eslint-disable @next/next/no-img-element */
import { PhoneIcon } from '@heroicons/react/24/outline';
import { phoneNumber } from 'lib/constants';
import { getMetaobject } from 'lib/shopify';
import { Suspense } from 'react';
import AccordionBlock from './page/accordion-block';
import Tag from './tag';

const FAQ = async ({ handle }: { handle: string }) => {
  const faqs = await getMetaobject({
    handle: { handle, type: 'accordion' }
  });

  if (!faqs) return null;

  return (
    <div className="bg-gray-100 px-6 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 lg:gap-20">
        <div className="col-span-1 flex flex-col gap-3">
          <Tag text="FAQ" />
          <h3 className="text-3xl font-semibold lg:text-4xl">Frequently Asked Questions</h3>
          <Suspense>
            <AccordionBlock block={faqs} />
          </Suspense>
        </div>
        <div className="relative col-span-1 hidden lg:block">
          <div className="absolute right-0 h-[500px] w-4/5">
            <img
              src="/images/faq-background.png"
              alt="FAQs background"
              className="absolute h-full w-full object-cover object-center"
            />
          </div>
          <div className="absolute left-0 top-0 flex min-h-[300px] min-w-[400px] translate-y-1/4 flex-col gap-3 bg-dark px-12 py-14">
            <Tag text="Let's Talk" invert />
            <p className="max-w-[250px] text-lg font-medium text-white">
              Need Any Help? Get Free Consultation
            </p>
            <div className="flex flex-row items-center gap-4 text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-500 bg-blue-600">
                <PhoneIcon className="size-5" />
              </div>
              <div>
                <p>Have Any Questions</p>
                <a href={phoneNumber?.link}>{phoneNumber?.title}</a>
              </div>
            </div>
            <button className="mt-5 w-fit rounded bg-primary px-4 py-2 text-sm text-white">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
