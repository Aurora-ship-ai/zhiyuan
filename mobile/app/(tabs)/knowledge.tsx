import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { colors, typography, spacing } from "../../theme";

const MOCK = [
  { id:"1", title:"Building Effective Agents", date:"Jun 18", concepts:3, cards:4, tags:["Agent","LLM"] },
  { id:"2", title:"AI Coding Best Practices", date:"Jun 17", concepts:2, cards:2, tags:["AI","Coding"] },
];

export default function KnowledgeScreen() {
  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}><Text style={s.brand}>Knowledge</Text><Text style={s.dt}>2 notes</Text></View>
      <FlatList
        data={MOCK}
        keyExtractor={(i) => i.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.tt}>{item.title}</Text>
            <View style={s.tgRow}>{(item.tags||[]).map((t,i) => <Text key={i} style={s.tg}>#{t}</Text>)}</View>
            <View style={s.meta}><Text style={s.mt}>{item.date} | {item.concepts} concepts | {item.cards} cards</Text></View>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>Generate notes from search results</Text>}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.background.primary},
  h:{padding:20,paddingBottom:12,flexDirection:"row",justifyContent:"space-between",alignItems:"baseline"},
  brand:{...typography.brand,color:colors.text.primary},
  dt:{...typography.caption,color:colors.text.tertiary},
  list:{paddingHorizontal:20},
  card:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,padding:14,marginBottom:10},
  tt:{...typography.h3,color:colors.text.primary,marginBottom:8},
  tgRow:{flexDirection:"row",flexWrap:"wrap",gap:4,marginBottom:8},
  tg:{fontSize:10,paddingHorizontal:8,paddingVertical:3,backgroundColor:colors.background.primary,borderRadius:4,color:colors.text.secondary},
  meta:{flexDirection:"row"},
  mt:{...typography.caption,color:colors.text.tertiary},
  empty:{textAlign:"center",padding:40,color:colors.text.tertiary,fontSize:13},
});
