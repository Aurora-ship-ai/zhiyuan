/**
 *  v2    
 * 
 * Readwise ReaderCraftLinear
 * 
 * 
 *  -  < 10%
 *  - 
 *  -  box-shadow
 */

export const colors = {
  // 
  background: {
    primary: "#F9F6F0",    //    #FAF7F2 
    card: "#F3EEE4",        //   
    elevated: "#EBE4D6",    //   /
    hover: "#FDFAF5",       //   
  },

  // 
  text: {
    primary: "#1F1A16",     //   
    secondary: "#5C5147",   //    #6B5E50
    tertiary: "#8E8275",    // 
    inverse: "#FDFAF5",     //   
  },

  // 
  accent: {
    primary: "#C0774E",     //    #C4734B
    hover: "#A85F3B",       // 
    dim: "#F2E2D5",         //   /
    secondary: "#3A5A45",   //    #3D5A4B
    secondaryDim: "#E4EDE3",// 
    gold: "#C49B5A",        //    #B8935A
    goldDim: "#F6ECD5",     // 
  },

  // 
  semantic: {
    error: "#C45A4A",       // 
    success: "#3A5A45",     // 
  },

  // 
  border: {
    default: "#E8E1D4",     //   
    strong: "#D5CCBB",      //   
    focus: "#C0774E",       //   
  },

  //  UI 
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

  // 
  state: {
    pressed: "rgba(0,0,0,0.06)",
    disabled: "rgba(0,0,0,0.30)",
  },
} as const;

export type ColorKey = keyof typeof colors;
