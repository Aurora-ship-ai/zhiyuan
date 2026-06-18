/**
 * 色彩令牌 —— 简约复古暖调学术色盘
 * 
 * 纪律：
 *  - 陶土色（主强调）占彩色面积 < 10%
 *  - 松绿和旧金只做点缀，不同时大面积出现
 *  - 不使用阴影，层次靠色差
 */

export const colors = {
  // 背景层级（从低到高）
  background: {
    primary: "#FAF7F2",    // 纸白 - 全局底色
    card: "#F3EFE7",        // 浅纸色 - 卡片/面板
    elevated: "#EBE5D8",    // 旧纸色 - 弹窗/浮层
  },

  // 文字层级
  text: {
    primary: "#2D2420",     // 墨色 - 正文
    secondary: "#6B5E50",   // 灰褐 - 辅助说明
    tertiary: "#9B8E7E",    // 浅褐 - 占位/禁用
    inverse: "#FAF7F2",     // 反白 - 深色底上的文字
  },

  // 功能色
  accent: {
    primary: "#C4734B",     // 陶土 - 主按钮/强调标记
    secondary: "#3D5A4B",   // 松绿 - 完成/链接
    gold: "#B8935A",        // 旧金 - 星标/高亮
  },

  // 语义色
  semantic: {
    error: "#C75B4A",       // 砖红 - 删除/警告
    success: "#3D5A4B",     // 成功（复用松绿）
  },

  // 边框与分割
  border: {
    default: "#E0D8C8",     // 暖灰线 - 分割线/卡片边框
    focus: "#C4734B",       // 陶土 - 聚焦态边框
  },

  // 状态叠加（press/hover 时在原色上叠加）
  state: {
    pressed: "rgba(0, 0, 0, 0.08)",   // 按下加深 8%
    disabled: "rgba(0, 0, 0, 0.30)",  // 禁用透明度
  },
} as const;

export type ColorKey = keyof typeof colors;
