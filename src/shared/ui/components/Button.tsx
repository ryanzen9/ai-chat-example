import { Button as KumoButton } from "@cloudflare/kumo";
import { PlusIcon } from "@phosphor-icons/react";

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
    <>
      <KumoButton
        variant={variant}
        icon={PlusIcon}
        onClick={handleClick}
        className="h-9 w-full !justify-center !rounded !bg-[var(--primary-container)] !text-white hover:!brightness-95"
      >
        {children}
      </KumoButton>
    </>
  );
}

export default Button;
