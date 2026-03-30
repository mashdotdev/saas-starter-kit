import clsx from "clsx";

interface CustomButtonProps {
  variant: "orange" | "white";
  text: string;
}

const CustomButton = ({ variant, text }: CustomButtonProps) => {
  return (
    <button
      className={clsx(
        `${variant === "orange" ? "bg-brand-orange text-white" : "bg-foreground text-black"}`,
        "py-4 px-4 lg:px-8 rounded-md cursor-pointer",
      )}
    >
      {text}
    </button>
  );
};

export default CustomButton;
