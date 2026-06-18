import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { colors, borderRadius } from "../../theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius: br = 4, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius: br, opacity },
        styles.base,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.elevated,
  },
});

/** 卡片骨架屏 */
export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="70%" height={20} borderRadius={4} />
      <View style={{ height: 8 }} />
      <Skeleton width="100%" height={14} />
      <View style={{ height: 6 }} />
      <Skeleton width="40%" height={14} />
    </View>
  );
}

const styles2 = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: 16,
    gap: 4,
  },
});
