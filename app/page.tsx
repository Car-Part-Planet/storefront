import Banner from 'components/banner';
import FAQ from 'components/faq';
import Hero from 'components/hero';
import About from 'components/home-page/about';
import InlinkBlock from 'components/home-page/inlink-block';
import WhyChoose from 'components/home-page/why-choose';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Metadata } from 'next';
import { Suspense } from 'react';

const { SITE_NAME, SITE_VERIFICATION_ID, STORE_PREFIX } = process.env;

export async function generateMetadata(): Promise<Metadata> {
  const description = `${SITE_NAME} is your ultimate destination for all your drivetrain replacement needs.`;

  return {
    title: SITE_NAME,
    description,
    openGraph: {
      type: 'website',
      title: SITE_NAME,
      description,
      images: {
        url: `/logo/${STORE_PREFIX}/logo-icon.png`,
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
      <header>
        <Banner />
        <Navbar />
      </header>
      <main className="max-h-full overflow-auto">
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
      </main>
    </>
  );
}
