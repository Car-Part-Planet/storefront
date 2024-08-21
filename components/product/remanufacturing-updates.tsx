'use client';

import RichTextDisplay from 'components/page/rich-text-display';
import { useProduct } from 'context/product-context';
import AccordionDetails from './accordion-details';

const RemanufacturingUpdates = () => {
  const { variant } = useProduct();
  if (!variant?.remanufacturingUpdates) {
    return null;
  }

  return (
    <div className="flex flex-col border-b border-t content-visibility-auto contain-intrinsic-size-[auto_500px] xl:border-b-0">
      <AccordionDetails title="Remanufacturing Updates" defaultOpen={false}>
        <div>
          <RichTextDisplay
            contentBlocks={JSON.parse(variant.remanufacturingUpdates || '{}').children}
          />
        </div>
      </AccordionDetails>
    </div>
  );
};

export default RemanufacturingUpdates;
