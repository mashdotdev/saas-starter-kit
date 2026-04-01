type Row = {
  label: string;
  symbol: string;
};

interface MarqueeProps {
  row: Row[];
}

const Marquee = ({ row }: MarqueeProps) => {
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-4 w-max"
        style={{ animation: "marquee-right 28s linear infinite" }}
      >
        {row.map(({ label, symbol }, i) => (
          <div
            key={`r2-${label}-${i}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 border border-white/30 backdrop-blur-sm whitespace-nowrap"
          >
            <span className="text-white/70 text-sm leading-none">{symbol}</span>
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
