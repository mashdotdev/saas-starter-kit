import clsx from "clsx";

interface CustomButtonProps {
  variant: "orange" | "white";
  text: string;
}

const CustomButton = ({ variant, text }: CustomButtonProps) => {
  return (
    <button
      className={clsx(
        `${variant === "orange" ? "bg-brand-orange text-white" : "bg-[#0a0a0a] text-white"}`,
        "py-3 px-4 lg:px-8 rounded-md cursor-pointer",
      )}
    >
      {text}
    </button>
  );
};

export default CustomButton;
