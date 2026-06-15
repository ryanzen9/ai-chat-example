import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/theme/theme-context";
import { Button } from "@/shared/ui/button";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun data-icon="inline-start" aria-hidden="true" />
      ) : (
        <Moon data-icon="inline-start" aria-hidden="true" />
      )}
    </Button>
  );
}

export { ThemeToggle };
