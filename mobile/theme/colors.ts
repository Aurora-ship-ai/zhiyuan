/**
 * 色彩令牌 v2 — 简约复古 × 精致温润
 * 
 * 参考：Readwise Reader（暖纸美学）、Craft（卡片质感）、Linear（间距精准）
 * 
 * 纪律：
 *  - 陶土色占画面彩色面积 < 10%
 *  - 松绿和旧金只做点缀，不同时大面积出现
 *  - 极淡阴影模拟纸张叠放（非传统 box-shadow）
 */

export const colors = {
  // 背景层级（从低到高）
  background: {
    primary: "#F9F6F0",    // 暖纸底 — 比之前的 #FAF7F2 更温润
    card: "#F3EEE4",        // 卡片面 — 略带暖灰调，更有纸张质感
    elevated: "#EBE4D6",    // 浮层面 — 更深一层，用于弹窗/底部面板
    hover: "#FDFAF5",       // 悬停高亮 — 几乎白但带暖意
  },

  // 文字层级
  text: {
    primary: "#1F1A16",     // 墨色更深 — 更有质感的正文色
    secondary: "#5C5147",   // 次文字更暖 — 之前是冷灰 #6B5E50
    tertiary: "#8E8275",    // 三级文字更有辨识度
    inverse: "#FDFAF5",     // 反白 — 用于深色底上的文字
  },

  // 功能色
  accent: {
    primary: "#C0774E",     // 陶土更深邃 — 之前 #C4734B，现在偏红铜
    hover: "#A85F3B",       // 按下态
    dim: "#F2E2D5",         // 陶土淡化 — 用于背景/选中态
    secondary: "#3A5A45",   // 松绿更深沉 — 之前 #3D5A4B
    secondaryDim: "#E4EDE3",// 松绿淡化
    gold: "#C49B5A",        // 旧金更浓郁 — 之前 #B8935A
    goldDim: "#F6ECD5",     // 旧金淡化
  },

  // 语义色
  semantic: {
    error: "#C45A4A",       // 砖红
    success: "#3A5A45",     // 复用松绿
  },

  // 边框与分割
  border: {
    default: "#E8E1D4",     // 暖灰线 — 更温润
    strong: "#D5CCBB",      // 强调分割 — 用于卡片间主分隔
    focus: "#C0774E",       // 聚焦态 — 复用陶土
  },

  // 阴影（极淡，模拟纸叠而非 UI 阴影）
  shadow: {
    sm: {
      shadowColor: "#3C2814",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: "#3C2814",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  },

  // 状态叠加
  state: {
    pressed: "rgba(0,0,0,0.06)",
    disabled: "rgba(0,0,0,0.30)",
  },
} as const;

export type ColorKey = keyof typeof colors;
