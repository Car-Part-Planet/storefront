'use client';

import { useProduct } from 'context/product-context';
import AccordionDetails from './accordion-details';

const Descriptions = () => {
  const { variant } = useProduct();

  if (!variant?.includes && !variant?.applicationSummary) {
    return null;
  }

  return (
    <div className="flex flex-col border-t">
      <AccordionDetails title="Description">
        <div className="space-y-2">
          {variant.includes && (
            <div className="mx-2 flex flex-row items-center gap-x-2">
              <div className="text-sm font-semibold text-content-dark">Includes</div>
              <div className="text-sm text-slate-700">{variant.includes}</div>
            </div>
          )}
          {variant.applicationSummary && (
            <div className="mx-2 flex flex-row items-center gap-x-2">
              <div className="text-sm font-semibold text-content-dark">Application Summary</div>
              <div className="text-sm text-slate-700">{variant.applicationSummary}</div>
            </div>
          )}
        </div>
      </AccordionDetails>
    </div>
  );
};

export default Descriptions;
