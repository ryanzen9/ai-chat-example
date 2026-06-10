import type { ChatCircleIcon } from "@phosphor-icons/react";

type NavItemProps = {
  label: string;
  icon: typeof ChatCircleIcon;
  active: boolean;
};

function NavItem({ label, icon: Icon, active }: NavItemProps) {
  return (
    <button
      className={[
        "flex h-10 w-full items-center gap-3 rounded border px-1 text-left text-[15px] font-semibold transition",
        active
          ? "border-[var(--border-subtle)] bg-[var(--surface-container)] text-[var(--primary-container)]"
          : "border-transparent text-[#cbd5e1] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-container)] hover:text-white",
      ].join(" ")}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

export default NavItem;
