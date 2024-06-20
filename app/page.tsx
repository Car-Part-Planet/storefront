import FAQ from 'components/faq';
import Hero from 'components/hero';
import About from 'components/home-page/about';
import Manufacturers from 'components/home-page/manufacturers';
import WhyChoose from 'components/home-page/why-choose';
import Footer from 'components/layout/footer';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const runtime = 'edge';
const { SITE_NAME } = process.env;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SITE_NAME,
    description: `${SITE_NAME} is your ultimate destination for all your drivetrain replacement needs.`,
    openGraph: {
      type: 'website'
    }
  };
}

export default async function HomePage() {
  return (
    <>
      <Suspense>
        <Hero />
      </Suspense>
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
        <Suspense>
          <Manufacturers />
        </Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
