import { PhoneIcon } from '@heroicons/react/24/solid';
import { phoneNumber } from 'lib/constants';
import { Button } from './ui';

const PhoneButton = () => {
  return (
    <div className="fixed bottom-6 right-6">
      <a href={phoneNumber?.link}>
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
