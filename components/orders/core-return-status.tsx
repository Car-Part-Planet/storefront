import Chip, { ChipProps } from 'components/ui/chip';
import { CoreReturnStatus, Order } from 'lib/shopify/types';

export default function CoreStatus({ order }: { order: Order }) {
  const coreReturnStatus = order?.coreReturnStatus?.value;

  if (!coreReturnStatus) {
    return null;
  }

  let level: ChipProps['level'] = 'warn';

  if (coreReturnStatus === CoreReturnStatus.CoreReceived || CoreReturnStatus.CoreRefunded) {
    level = 'success';
  }

  return <Chip level={level}>Core Return: {coreReturnStatus}</Chip>;
}
