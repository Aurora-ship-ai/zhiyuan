import { Platform, TextStyle } from "react-native";

const serif = Platform.select({ ios: "Noto Serif CJK SC", default: "Georgia" });
const sans = Platform.select({ ios: "Noto Sans CJK SC", default: "Inter" });
const mono = Platform.select({ ios: "JetBrains Mono", default: "Menlo" });

export const fonts = { serif, sans, mono } as const;

export const typography: Record<string, TextStyle> = {
  brand: {
    fontFamily: serif,
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.02,
  },
  h1: {
    fontFamily: serif,
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 34,
    letterSpacing: 0,
  },
  h2: {
    fontFamily: serif,
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 27,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 23,
    letterSpacing: 0,
  },
  body: {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16 * 1.65,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: sans,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 14 * 1.6,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: sans,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 12 * 1.5,
    letterSpacing: 0,
  },
  captionStrong: {
    fontFamily: sans,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 12 * 1.5,
    letterSpacing: 0,
  },
  label: {
    fontFamily: sans,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 11 * 1.4,
    letterSpacing: 0,
  },
  code: {
    fontFamily: mono,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 14 * 1.6,
    letterSpacing: 0,
  },
  button: {
    fontFamily: sans,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0,
  },
} as const;
