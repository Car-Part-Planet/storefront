import FAQ from 'components/faq';
import Hero from 'components/hero';
import About from 'components/home-page/about';
import InlinkBlock from 'components/home-page/inlink-block';
import WhyChoose from 'components/home-page/why-choose';
import Footer from 'components/layout/footer';
import { Metadata } from 'next';
import { Suspense } from 'react';

const { SITE_NAME, SITE_VERIFICATION_ID, STORE_PREFIX } = process.env;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SITE_NAME,
    description: `${SITE_NAME} is your ultimate destination for all your drivetrain replacement needs.`,
    openGraph: {
      type: 'website',
      title: SITE_NAME,
      images: {
        url: `../../public/logo/${STORE_PREFIX}/logo.svg`,
        width: 380,
        height: 50,
        alt: SITE_NAME
      }
    },
    robots: {
      follow: true,
      index: true
    },
    verification: {
      google: SITE_VERIFICATION_ID
    }
  };
}

export default async function HomePage() {
  return (
    <>
      <Hero />
      <div className="flex min-h-96 flex-col">
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <WhyChoose />
        </Suspense>
        <Suspense>
          <FAQ handle="home-page-faqs" />
        </Suspense>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-20">
          <InlinkBlock />
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
