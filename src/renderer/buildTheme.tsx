import { ThemeConfig, theme } from "antd";

const getCssVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName);

export function buildTheme(mode: "dark" | "light"): ThemeConfig {
  return {
    cssVar: { prefix: "ehs" },
    algorithm: [mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm],
    token: {
      colorPrimary: getCssVar("--sys-accent-color"),
      colorError: "#db4437",
      colorWarning: "#ffa600",
      colorSuccess: "#43a047",
      colorInfo: "#039be5",
      borderRadius: 6,
      fontSizeIcon: 20,

      motionDurationFast: "120ms",
      motionDurationMid: "180ms",
      motionDurationSlow: "360ms",

      padding: 10,
      marginXS: 0,

      // colorBgContainer: "transparent",
    },
    components: {},
  };
}
