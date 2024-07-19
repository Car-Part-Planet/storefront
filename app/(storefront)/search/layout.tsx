import Footer from 'components/layout/footer';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-[500px] lg:min-h-[800px]">{children}</div>

      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
