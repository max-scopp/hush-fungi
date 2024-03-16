import { ThemeConfig, theme } from "antd";

const getCssVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName);

export function buildTheme(): ThemeConfig {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return {
    cssVar: { prefix: "ehs" },
    algorithm: [isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm],
    token: {
      colorPrimary: getCssVar("--sys-accent-color"),
      borderRadius: 6,
      fontSizeIcon: 24,

      // colorBgContainer: "transparent",
    },
  };
}
