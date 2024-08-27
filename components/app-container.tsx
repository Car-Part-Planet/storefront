import { ReactNode, Suspense } from 'react';
import Banner from './banner';
import Navbar from './layout/navbar';

const AppContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="sticky top-0">
        <Banner />
        <Navbar />
      </header>
      <Suspense>
        <main className="max-h-full grow overflow-y-auto">{children}</main>
      </Suspense>
    </>
  );
};

export default AppContainer;
