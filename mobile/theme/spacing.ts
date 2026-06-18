const BASE = 4;

export const spacing = {
  "2xs": BASE * 1,    // 4  — 微间距
  xs: BASE * 2,       // 8  — 图标与文字
  sm: BASE * 3,       // 12 — 元素内
  md: BASE * 4,       // 16 — 卡片内边距
  lg: BASE * 5,       // 20 — 页面水平边距
  xl: BASE * 6,       // 24 — 模块间距
  "2xl": BASE * 8,    // 32
  "3xl": BASE * 12,   // 48
} as const;

export const borderRadius = {
  sm: BASE * 1.5,     // 6
  md: BASE * 2.5,     // 10 — 卡片
  lg: BASE * 3.5,     // 14
  pill: BASE * 6,     // 24 — 搜索栏/标签
} as const;

export const MIN_TOUCH_SIZE = 44;
