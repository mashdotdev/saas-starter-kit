import Header from "@/components/header";
import SmoothScroll from "@/components/smooth-scroll";
import Headline from "@/components/headline";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Headline />
      <Header />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
