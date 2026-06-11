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
        "flex h-10 w-full items-center gap-3 rounded-md border px-1 text-left text-[15px] font-semibold transition",
        active
          ? "border-border bg-muted text-primary"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

export default NavItem;
