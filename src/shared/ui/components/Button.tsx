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
      <PlusIcon data-icon="inline-start" weight="bold" aria-hidden="true" />
      {children}
    </ShadcnButton>
  );
}

export default Button;
