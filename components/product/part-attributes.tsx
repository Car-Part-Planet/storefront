'use client';

import { useProduct } from 'context/product-context';
import AccordionDetails from './accordion-details';

const PartAttributes = () => {
  const { variant } = useProduct();

  if (!variant?.partAttributes || Object.keys(variant.partAttributes).length === 0) {
    return null;
  }

  const partAttributes = variant.partAttributes;

  return (
    <div className="flex flex-col border-t content-visibility-auto contain-intrinsic-size-[auto_300px]">
      <AccordionDetails title="Part Attributes">
        <div className="grid grid-cols-1 gap-2 px-2 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(partAttributes).map(([key, value]) => (
            <div
              className="flex flex-row items-center gap-x-2 md:flex-col md:items-start md:gap-x-0"
              key={key}
            >
              <div className="text-sm font-semibold text-content-dark">{key}</div>
              <div className="text-sm text-slate-700">{value}</div>
            </div>
          ))}
        </div>
      </AccordionDetails>
    </div>
  );
};

export default PartAttributes;
