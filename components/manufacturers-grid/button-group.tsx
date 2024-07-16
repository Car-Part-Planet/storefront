import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { Metaobject } from 'lib/shopify/types';
import Link from 'next/link';

const ButtonGroup = ({
  manufacturer,
  prefetch
}: {
  manufacturer: Metaobject;
  prefetch: boolean;
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-x-2">
      <Link
        href={`/engines/${manufacturer.name}`}
        className="flex items-center gap-1 rounded border border-primary px-1 py-0.5 text-xs text-primary"
        prefetch={prefetch}
      >
        Engines <ArrowRightIcon className="size-3" />
      </Link>

      <Link
        className="flex items-center gap-1 rounded border border-transparent bg-primary/10 px-1 py-0.5 text-xs text-primary"
        href={`/transmissions/${manufacturer.name}`}
        prefetch={prefetch}
      >
        Transmissions <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
};

export default ButtonGroup;
