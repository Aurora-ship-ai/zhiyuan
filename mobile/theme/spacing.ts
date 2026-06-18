/**
 * 空间系统
 * 
 * 基础单位：4px
 */

const BASE = 4;

export const spacing = {
  /** 4px - 微间距（图标与文字） */
  xs: BASE * 1,       // 4
  /** 8px - 小间距（元素内） */
  sm: BASE * 2,       // 8
  /** 12px - 中间距 */
  md: BASE * 3,       // 12
  /** 16px - 标准间距（卡片内边距） */
  lg: BASE * 4,       // 16
  /** 20px - 页面水平边距 */
  pageX: BASE * 5,    // 20
  /** 24px - 模块间距 */
  xl: BASE * 6,       // 24
  /** 32px */
  xxl: BASE * 8,      // 32
  /** 48px */
  xxxl: BASE * 12,    // 48
} as const;

export const borderRadius = {
  /** 4px - 标签 */
  sm: BASE * 1,       // 4
  /** 8px - 卡片、按钮 */
  md: BASE * 2,       // 8
  /** 24px - 搜索栏（胶囊形） */
  pill: BASE * 6,     // 24
} as const;

/** 可点击区域最小尺寸 44x44（移动端） */
export const MIN_TOUCH_SIZE = 44;
