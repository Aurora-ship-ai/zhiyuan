import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { colors, borderRadius } from "../../theme";

interface SkeletonProps {
  width?: number | string; height?: number; borderRadius?: number; style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius: br = 4, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [opacity]);

  return <Animated.View style={[{ width: width as any, height, borderRadius: br, opacity }, s.base, style]} />;
}

export function CardSkeleton() {
  return (
    <View style={s.card}>
      <Skeleton width="70%" height={20} />
      <View style={{ height: 8 }} />
      <Skeleton width="100%" height={14} />
      <View style={{ height: 6 }} />
      <Skeleton width="40%" height={14} />
    </View>
  );
}

const s = StyleSheet.create({
  base: { backgroundColor: colors.background.elevated },
  card: { backgroundColor: colors.background.card, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border.default, padding: 16, gap: 4 },
});
