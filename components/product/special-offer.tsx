import {
  ArrowPathIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const { STORE_PREFIX } = process.env as { STORE_PREFIX?: string };

const storeConfig: Record<
  string,
  { shippingTitle: string; shippingText: string; warrantyTitle: string; warrantyText: string }
> = {
  'reman-transmission': {
    shippingTitle: 'Flat Rate Shipping',
    shippingText: 'We offer a flat $299 shipping fee to commercial addresses',
    warrantyTitle: 'Unbeatable Warranty',
    warrantyText: 'Up to 5 years with unlimited miles on select parts'
  },
  default: {
    shippingTitle: 'Free Shipping',
    shippingText: 'We offer free shipping to commercial addresses',
    warrantyTitle: 'Unbeatable Warranty',
    warrantyText: 'Up to 5 years with unlimited miles on select parts'
  }
};

const config = storeConfig[STORE_PREFIX!] || storeConfig.default;

const Offer = ({
  title,
  description,
  icon
}: {
  title?: string;
  description?: string;
  icon: JSX.Element;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-gray-100 p-2">{icon}</div>
      <div className="text-content-dark flex flex-col">
        <span className="text-sm font-medium md:text-base">{title}</span>
        <span className="hidden text-sm md:flex">{description}</span>
      </div>
    </div>
  );
};

const SpecialOffer = () => {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-5 xl:mt-5 xl:gap-5">
      <Offer
        title={config?.shippingTitle}
        description={config?.shippingText}
        icon={<TruckIcon className="size-6 text-primary" />}
      />
      <Offer
        icon={<CurrencyDollarIcon className="size-6 text-primary" />}
        title="Best Price Guarantee"
        description="We will match or beat any competitor's pricing"
      />
      <Offer
        icon={<ShieldCheckIcon className="size-6 text-primary" />}
        title={config?.warrantyTitle}
        description={config?.warrantyText}
      />
      <Offer
        title="Excellent Support"
        description="End-to-end, expert care from our customer service team"
        icon={<UsersIcon className="size-6 text-primary" />}
      />
      <Offer
        icon={<ArrowPathIcon className="size-6 text-primary" />}
        title="Core Charge Waiver"
        description="Avoid the core charge by returning within 30 days"
      />

      <Offer
        icon={<StarIcon className="size-6 text-primary" />}
        title="Free Core Return"
        description="Unlike competitors, we pay for the return of your core"
      />
    </div>
  );
};

export default SpecialOffer;
