import PricingCard from "../pricing-card";

const Pricing = () => {
  return (
    <section className="py-24 container mx-auto px-4 md:px-0" id="pricing">
      <h1 className="text-center text-5xl md:text-7xl font-heading uppercase tracking-tight leading-[0.92]">
        Choose your velocity
      </h1>
      <p className="text-center text-base md:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
        Open source for the community, premium support for the pros
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-18 ">
        <PricingCard variant={"open-source"} />
        <PricingCard variant={"pro"} />
      </div>
    </section>
  );
};

export default Pricing;
