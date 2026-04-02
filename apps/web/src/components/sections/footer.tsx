const Footer = () => {
  return (
    <footer className="pt-24 min-h-[50vh] flex flex-col">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="font-heading text-4xl leading-none">SaaS Kit</h3>
          <p className="max-w-xs mt-4 text-zinc-400">
            The ultimate starter kit for thigh performance SaaS.
          </p>
        </div>

        <div>
          <h3 className="font-subheading text-xl">Company</h3>
          <ul className="mt-4 text-zinc-400 space-y-4">
            {["About Me", "Upwork", "Contact"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-subheading text-xl">Product</h3>
          <ul className="mt-4 text-zinc-400 space-y-4">
            {["Features", "Pricing", "Live Demo"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-subheading text-xl">Community</h3>
          <ul className="mt-4 text-zinc-400 space-y-4">
            {["Github", "Discord"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <h1 className="text-[8vw] text-brand-orange mt-auto tracking-widest font-heading text-center bg-transparent">
        SaaS Kit by mashdotdev
      </h1>
    </footer>
  );
};

export default Footer;
