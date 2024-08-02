import { GoogleAnalytics } from '@next/third-parties/google';
import Banner from 'components/banner';
import LogoSquare from 'components/logo-square';
import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode, Suspense } from 'react';
import '../globals.css';

const { STORE_PREFIX, SITE_NAME, GA_ID } = process.env;
export const metadata: Metadata = {
  title: `Cart | ${SITE_NAME}`,
  icons: {
    icon: `/logo/${STORE_PREFIX}/logo-icon.png`
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen bg-white text-black selection:bg-primary-muted">
        <header>
          <Banner />
          <div className="border-b border-gray-200 py-4">
            <div className="mx-auto flex max-w-2xl justify-center pl-4 sm:px-6 md:justify-start lg:max-w-7xl">
              <Link href="/" className="flex">
                <LogoSquare />
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-4 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8">
          <Suspense>{children}</Suspense>
        </main>
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
