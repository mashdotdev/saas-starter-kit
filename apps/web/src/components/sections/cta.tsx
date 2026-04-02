const CTA = () => {
  return (
    <section className="py-24 bg-brand-orange">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-center text-5xl md:text-9xl font-heading uppercase tracking-tight leading-[0.92]">
          Ready to build your <br /> next big thing?
        </h1>

        <p className="text-center text-base md:text-lg text-zinc-400 mt-4">
          Join developers who stopped building boilerplates and started building
          products
        </p>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button className="bg-white text-black rounded-lg py-4 px-6 cursor-pointer">
            Get the Kit
          </button>
          <button className="border border-white/50 rounded-lg py-4 px-6 cursor-pointer">
            ⭐ Star on Github
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
