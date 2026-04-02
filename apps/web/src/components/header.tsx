import Link from "next/link";

const Header = () => {
  return (
    <header className="h-16 border-t border-white/20">
      <div className="container mx-auto px-4 md:px-0 size-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-heading tracking-wide">SaaS kit</span>
          <div className="flex items-center gap-4 ml-4">
            <Link href={"#features"}>Features</Link>
            <Link href={"#pricing"}>Pricing</Link>
            <Link href={"https://github.com/mashdotdev/saas-starter-kit.git"}>
              Github
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href={""} className="cursor-pointer">
            Hire Me
          </Link>
          <Link href={""} className="bg-white text-black py-2 px-4 rounded-lg">
            Get the Kit
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
