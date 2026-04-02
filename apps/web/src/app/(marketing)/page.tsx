import Architecture from "@/components/sections/architecture";
import CTA from "@/components/sections/cta";
import FAQs from "@/components/sections/faq";
import Hero from "@/components/sections/hero";
import Pricing from "@/components/sections/pricing";
import Problems from "@/components/sections/problems";
import Scale from "@/components/sections/scale";

const Home = () => {
  return (
    <main>
      <Hero />
      <Scale />
      <Problems />
      <Architecture />
      <Pricing />
      <FAQs />
      <CTA />
    </main>
  );
};

export default Home;
