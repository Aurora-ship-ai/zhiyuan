import { TextStyle } from "react-native";

/**
 * 字体系统
 * 
 * 规则：
 *  - 衬线体仅用于标题，正文一律无衬线
 *  - 正文行高 1.7，标题行高 1.3
 */

// 平台字体回退
const serif = Platform.select({
  ios: "Noto Serif CJK SC",
  android: "Noto Serif CJK SC",
  default: "Georgia",
});

const sans = Platform.select({
  ios: "Noto Sans CJK SC",
  android: "Noto Sans CJK SC",
  default: "Inter",
});

const mono = Platform.select({
  ios: "JetBrains Mono",
  android: "JetBrains Mono",
  default: "Menlo",
});

import { Platform } from "react-native";

export const fonts = {
  serif,
  sans,
  mono,
} as const;

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: serif,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 28 * 1.3,
    letterSpacing: 0,
  },
  h2: {
    fontFamily: serif,
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 22 * 1.3,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: serif,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 18 * 1.3,
    letterSpacing: 0,
  },
  body: {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16 * 1.7,
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
    fontWeight: "300",
    lineHeight: 12 * 1.5,
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
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
  },
} as const;
