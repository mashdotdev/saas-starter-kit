"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Pricing", href: "#pricing" },
  {
    label: "Github",
    href: "https://github.com/mashdotdev/saas-starter-kit.git",
  },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-t border-white/20 relative z-50">
      {/* Main bar */}
      <div className="container mx-auto px-4 md:px-0 h-16 flex items-center justify-between">
        {/* Left — logo + desktop nav */}
        <div className="flex items-center gap-6">
          <span className="text-3xl font-heading tracking-wide">SaaS kit</span>
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right — desktop CTAs + mobile hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6">
            <Link href={""} className="text-sm text-zinc-400 hover:text-white transition-colors">
              Hire Me
            </Link>
            <Link
              href={""}
              className="bg-white text-black text-sm py-2 px-4 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Get the Kit
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-px bg-white transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-white transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-background px-4 py-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-base text-zinc-300 hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <Link
              href={""}
              className="text-base text-zinc-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              Hire Me
            </Link>
            <Link
              href={""}
              className="bg-white text-black text-sm py-2.5 px-4 rounded-lg text-center hover:bg-zinc-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              Get the Kit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
