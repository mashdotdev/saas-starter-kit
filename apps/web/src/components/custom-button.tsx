import clsx from "clsx";
import Link from "next/link";

interface CustomButtonProps {
  variant: "orange" | "white";
  text: string;
  href?: string;
}

const CustomButton = ({ variant, text, href }: CustomButtonProps) => {
  return (
    <Link
      href={href || "#"}
      className={clsx(
        `${variant === "orange" ? "bg-brand-orange text-white" : "bg-[#0a0a0a] text-white"}`,
        "py-3 px-4 lg:px-8 rounded-md cursor-pointer",
      )}
    >
      {text}
    </Link>
  );
};

export default CustomButton;
