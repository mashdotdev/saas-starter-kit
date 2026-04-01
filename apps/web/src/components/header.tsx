const Header = () => {
  return (
    <header className="h-16 border-t border-white/20">
      <div className="container mx-auto px-4 md:px-0 size-full flex items-center">
        {/* name */}
        <span className="text-3xl font-heading tracking-wide border-r pr-4 border-white/20">
          SaaS kit
        </span>
      </div>
    </header>
  );
};

export default Header;
