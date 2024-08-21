import {
  BeakerIcon,
  BoltIcon,
  CpuChipIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/outline';
import { Product } from 'lib/shopify/types';

const Detail = ({
  icon,
  title,
  value
}: {
  icon: JSX.Element;
  title: string;
  value?: string | null;
}) => {
  return (
    <div className="flex flex-row items-center gap-3 rounded bg-gray-100 px-5 py-3">
      {icon}
      <div className="flex flex-col text-sm">
        <span className="text-content-dark">{title}</span>
        <span className="font-medium text-content-dark">{value}</span>
      </div>
    </div>
  );
};

const ProductDetails = ({ product }: { product: Product }) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {product.transmissionType && (
          <Detail
            title="Type"
            value={product.transmissionType}
            icon={<CubeTransparentIcon className="size-4" />}
          />
        )}

        {product.transmissionSpeeds && product.transmissionSpeeds.length && (
          <Detail
            title="Speeds"
            value={`${product.transmissionSpeeds[0]}-Speed`}
            icon={<BoltIcon className="size-4" />}
          />
        )}
        {product.driveType && (
          <Detail
            title="Drive type"
            value={product.driveType[0]}
            icon={<BoltIcon className="size-4" />}
          />
        )}
        {product.engineCylinders?.length && (
          <Detail
            title="Number of cylinders"
            value={`${product.engineCylinders[0]} Cylinders`}
            icon={<BeakerIcon className="size-4" />}
          />
        )}
        {product.transmissionCode?.length && (
          <Detail
            title="Code"
            value={product.transmissionCode[0]}
            icon={<CpuChipIcon className="size-4" />}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
