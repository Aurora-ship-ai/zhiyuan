import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { colors, typography, spacing } from "../../theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}><Text style={s.brand}>Profile</Text></View>
      <View style={s.card}><Text style={s.num}>2</Text><Text style={s.lbl}>Notes</Text></View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.background.primary},
  h:{padding:20,paddingBottom:12},
  brand:{...typography.brand,color:colors.text.primary},
  card:{marginHorizontal:20,padding:24,backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,alignItems:"center"},
  num:{fontFamily:"Georgia",fontSize:32,fontWeight:"700",color:colors.accent.primary},
  lbl:{fontSize:11,color:colors.text.tertiary,marginTop:4},
});
