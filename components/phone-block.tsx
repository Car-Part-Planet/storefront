import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { phoneNumber } from 'lib/constants';

const PhoneBlock = () => {
  return (
    <div className="rounded-md border border-blue-700 bg-blue-50 p-2">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="font-medium text-blue-700">Have questions? Speak to a specialist now:</p>
          <div className="md:flex md:justify-between">
            <p className="mt-1 text-blue-700 md:mt-0">
              <a
                href={phoneNumber?.link}
                className="whitespace-nowrap text-blue-700 hover:text-blue-600"
              >
                {phoneNumber?.title}
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneBlock;
