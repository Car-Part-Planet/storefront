'use client';

import { Order, WarrantyStatus } from 'lib/shopify/types';
import { isBeforeToday } from 'lib/utils';
import { useState } from 'react';
import ActivateWarrantyModal from './activate-warranty-modal';
import { Button } from 'components/ui';

type ActivateWarrantyModalProps = {
  order: Order;
};

const ActivateWarranty = ({ order }: ActivateWarrantyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActivated = order?.warrantyStatus?.value === WarrantyStatus.Activated;
  const isPassDeadline = isBeforeToday(order?.warrantyActivationDeadline?.value);
  const isOrderConfirmed = order?.orderConfirmation?.value;

  if (!isOrderConfirmed) {
    return null;
  }

  if (isPassDeadline || isActivated) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Activate Warranty</Button>
      <ActivateWarrantyModal isOpen={isOpen} onClose={() => setIsOpen(false)} order={order} />
    </>
  );
};

export default ActivateWarranty;
