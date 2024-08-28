import { PhoneIcon } from '@heroicons/react/24/solid';
import { phoneNumberMap } from 'lib/constants';

const EmptyVariant = ({ condition }: { condition: 'remanufactured' | 'used' }) => {
  const phoneNumber = phoneNumberMap[process.env.NEXT_PUBLIC_STORE_PREFIX!];
  return (
    <a
      className="flex flex-row items-center gap-1 rounded-lg bg-gray-100 px-4 py-3 text-sm text-blue-700 hover:bg-gray-200"
      href={phoneNumber?.link}
    >
      <span>Call for {condition} options availibility</span>
      <PhoneIcon className="ml-1 size-4" />
    </a>
  );
};

export default EmptyVariant;
