/* eslint-disable @next/next/no-img-element */
import { getMetaobject } from 'lib/shopify';
import kebabCase from 'lodash.kebabcase';
import Image from 'next/image';
import { Suspense } from 'react';
import HomePageFilters, { HomePageFiltersPlaceholder } from './filters/hompage-filters';
import DynamicHeroIcon from './hero-icon';
import { NextImageDisplay } from './page/image-display';

const { SITE_NAME, STORE_PREFIX } = process.env;

const offers = [
  {
    title:
      STORE_PREFIX === 'reman-transmission'
        ? 'Flat Rate Shipping (Commercial Address)'
        : 'Free Shipping (Commercial Address)',
    icon: 'truck'
  },
  {
    title: 'Up to 5 Years Unlimited Miles Warranty',
    icon: 'arrow-path-rounded-square'
  },
  {
    title: 'Fully Refundable Core Charge',
    icon: 'currency-dollar'
  },
  {
    title: 'Excellent Customer Support',
    icon: 'star'
  }
];

const Offers = () => {
  return (
    <nav aria-label="Offers" className="order-last bg-white lg:order-first">
      <div className="max-w-8xl mx-auto lg:px-8">
        <ul
          role="list"
          className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-4 lg:divide-x lg:divide-y-0"
        >
          {offers.map((offer) => (
            <li
              key={offer.title}
              className="flex w-full items-center justify-start px-4 lg:justify-center"
            >
              <DynamicHeroIcon icon={offer.icon} className="size-7 flex-shrink-0 text-secondary" />
              <p className="px-3 py-4 text-sm font-medium text-gray-800 md:py-5">{offer.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const HeroImage = async () => {
  const heroImage = await getMetaobject({
    handle: { type: 'hero', handle: `${kebabCase(SITE_NAME)}-hero` }
  });

  return heroImage ? (
    <Suspense>
      <NextImageDisplay
        fileId={heroImage.file as string}
        title="Hero Image"
        priority
        className="h-full w-full object-cover object-center"
        sizes="100vw"
        width={1103}
        height={626}
      />
    </Suspense>
  ) : (
    <Image
      src="/hero-image.jpeg"
      alt="Hero Image"
      width={1103}
      height={626}
      priority
      className="h-full w-full object-cover object-center"
      sizes="100vw"
    />
  );
};

const Hero = () => {
  return (
    <div className="flex flex-col border-b border-gray-200 lg:border-0">
      <Offers />
      <div className="relative">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <Suspense fallback={<div className="h-[626px] w-full" />}>
            <HeroImage />
          </Suspense>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-dark opacity-80" />
        <div className="flex flex-col gap-10 px-6 py-5 text-center sm:pb-56 sm:pt-32 lg:px-0">
          <div className="relative mx-auto hidden items-center justify-center gap-4 text-white md:flex">
            <img src="/images/best-price.svg" alt="Best Price" width={100} height={90} />
            <div className="flex w-1/2 flex-col items-start gap-0.5 text-left">
              <p className="tracking-wide">Best Price Guarantee</p>
              <p className="text-sm tracking-wide">
                We will match or beat any competitor&apos;s pricing.
              </p>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center @container md:w-3/4">
            <Suspense fallback={<HomePageFiltersPlaceholder />}>
              <HomePageFilters />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
