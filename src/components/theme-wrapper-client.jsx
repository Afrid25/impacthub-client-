"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeWrapperClient({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  ...props
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
