import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { colors, typography, spacing } from "../../theme";

export default function PendingScreen() {
  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}><Text style={s.brand}>Pending</Text><Text style={s.dt}>0 items</Text></View>
      <Text style={s.empty}>Save materials from search results to read later</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.background.primary},
  h:{padding:20,paddingBottom:12,flexDirection:"row",justifyContent:"space-between",alignItems:"baseline"},
  brand:{...typography.brand,color:colors.text.primary},
  dt:{...typography.caption,color:colors.text.tertiary},
  empty:{textAlign:"center",padding:40,color:colors.text.tertiary,fontSize:13},
});
