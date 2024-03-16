import { ThemeConfig } from "antd";

const getCssVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName);

export function buildTheme(): ThemeConfig {
  return {
    token: {
      colorPrimary: getCssVar("--sys-accent-color"),
      borderRadius: 8,

      // colorBgContainer: "transparent",
    },
  };
}
