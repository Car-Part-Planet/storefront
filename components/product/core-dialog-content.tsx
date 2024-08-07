import PhoneBlock from 'components/phone-block';

const { SITE_NAME } = process.env;

const CoreDialogContent = () => {
  return (
    <div className="mt-5 flex flex-col space-y-5">
      <section>
        <p className="text-md mb-3 font-semibold">What is a core charge?</p>
        <p className="mb-3 text-sm">
          When you purchase a remanufactured transmission, the price assumes that you return your
          old transmission. This old part is called a core.
        </p>
        <p className="text-sm">
          The core charge is a refundable deposit that is added to the price of the part to ensure
          that the old part is returned for proper disposal or remanufacturing. When you return the
          old part, you receive a refund of the core charge.
        </p>
      </section>

      <section>
        <p className="text-md mb-3 font-semibold">Understanding our core waiver</p>
        <p className="mb-3 text-sm">
          At {SITE_NAME}, we offer a 30-day core waiver option on some of our transmissions. This
          means that you can choose to waive the core deposit for up to 30 days after your purchase.
          As long as you return your old part within the 30-day period, you will never need to pay
          the core charge.
        </p>
        <p className="text-sm">
          If you don&apos;t manage to return the old part within the 30-day period, we will then
          charge you the core charge. This keeps more money in your pocket upfront.
        </p>
      </section>

      <section>
        <p className="text-md mb-3 font-semibold">Returning your core</p>
        <p className="text-sm">
          We will pick up your core at no cost to you. Simply let us know that the core is ready and
          we will send you a prepaid label, as well as a driver to pick up the core.
        </p>
      </section>

      <section>
        <PhoneBlock />
      </section>
    </div>
  );
};

export default CoreDialogContent;
