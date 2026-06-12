import { PlusIcon } from "@phosphor-icons/react";
import { Button as ShadcnButton } from "../button";

function Button({
  children,
  handleClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  handleClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <ShadcnButton
      type="button"
      variant={variant === "primary" ? "default" : "outline"}
      onClick={handleClick}
      className="h-9 w-full justify-center rounded-md"
    >
      <PlusIcon
        size={16}
        weight="bold"
        className="mr-1.5"
        aria-hidden="true"
      />
      {children}
    </ShadcnButton>
  );
}

export default Button;
