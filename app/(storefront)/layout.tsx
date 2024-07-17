import Banner from 'components/banner';
import Navbar from 'components/layout/navbar';
import { GeistSans } from 'geist/font/sans';
import { ensureStartsWith } from 'lib/utils';
import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import '../globals.css';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME, STORE_PREFIX, SHOPIFY_ORIGIN_URL } = process.env;
const baseUrl = SHOPIFY_ORIGIN_URL ? SHOPIFY_ORIGIN_URL : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    }),
  icons: {
    icon: `/logo/${STORE_PREFIX}/logo-icon.svg`
  },
  alternates: {
    canonical: './'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen bg-white text-black selection:bg-primary-muted">
        <div className="flex h-screen flex-col">
          <header>
            <Banner />
            <Navbar />
          </header>
          <Suspense>
            <main>{children}</main>
          </Suspense>
        </div>
      </body>
    </html>
  );
}