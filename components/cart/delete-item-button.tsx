'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { removeItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib/shopify/types';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Remove cart item"
      aria-disabled={pending}
      className={clsx('flex h-[17px] w-[17px] items-center justify-center', {
        'cursor-not-allowed px-0': pending
      })}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <XMarkIcon className="size-6 text-gray-500" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: CartItem }) {
  const [message, formAction] = useFormState(removeItem, null);
  const { id: itemId, coreCharge, addOnProduct } = item;
  const actionWithVariant = formAction.bind(null, [
    itemId,
    ...(coreCharge?.id ? [coreCharge.id] : []),
    ...(addOnProduct?.id ? [addOnProduct.id] : [])
  ]);

  return (
    <form action={actionWithVariant}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
