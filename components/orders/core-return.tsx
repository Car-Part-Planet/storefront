'use client';
import { Button } from 'components/ui';
import { CoreReturnStatus, Order } from 'lib/shopify/types';
import { useState } from 'react';
import CoreReturnModal from './core-return-modal';
import { isBeforeToday } from 'lib/utils';

export default function CoreReturn({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);
  const coreReturnDeadline = order?.coreReturnDeadline?.value;
  const coreReturnStatus = order?.coreReturnStatus?.value;

  if (!coreReturnDeadline) return null;

  const isPassDeadline = isBeforeToday(coreReturnDeadline);

  if (coreReturnStatus !== CoreReturnStatus.CoreNeeded || isPassDeadline) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Core Return</Button>
      <CoreReturnModal order={order} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
