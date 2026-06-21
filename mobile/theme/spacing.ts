const BASE = 4;

export const spacing = {
  "2xs": BASE * 1,    // 4   
  xs: BASE * 2,       // 8   
  sm: BASE * 3,       // 12  
  md: BASE * 4,       // 16  
  lg: BASE * 5,       // 20  
  xl: BASE * 6,       // 24  
  "2xl": BASE * 8,    // 32
  "3xl": BASE * 12,   // 48
} as const;

export const borderRadius = {
  sm: BASE * 1.5,     // 6
  md: BASE * 2.5,     // 10  
  lg: BASE * 3.5,     // 14
  pill: BASE * 6,     // 24  /
} as const;

export const MIN_TOUCH_SIZE = 44;
