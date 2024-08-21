import { ReactNode } from 'react';

const FixedBuySection = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-between bg-white p-4 shadow-lg md:hidden">
      {children}
    </div>
  );
};

export default FixedBuySection;
