import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, TextInput } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { searchMaterials } from "../../services/api";
import type { SearchResult } from "../../types";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = query.trim(); if (!q) return;
    setLoading(true);
    try {
      const resp = await searchMaterials({ query: q, page_size: 10 });
      setResults(resp.results); setSearched(true);
    } catch (e) { setResults([]); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}><Text style={s.brand}>ZhiYuan</Text><Text style={s.date}>Jun 18</Text></View>
      <View style={s.sb}><TextInput style={s.si} placeholder="Search any topic..." value={query} onChangeText={setQuery} onSubmitEditing={handleSearch} returnKeyType="search" placeholderTextColor={colors.text.tertiary} /></View>
      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={handleSearch} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={[s.card, item.score >= 9 && s.cardFt]} activeOpacity={0.95}>
            <View style={s.ch}><View style={[s.sc, item.score >= 9 && s.scHi]}><Text style={[s.scT, item.score >= 9 && {color:colors.accent.secondary}]}>{item.score}</Text></View><Text style={s.src}>{item.source}</Text></View>
            <Text style={s.tt}>{item.title}</Text>
            <Text style={s.sum} numberOfLines={2}>{item.summary}</Text>
            <View style={s.tgs}>{(item.tags||[]).map((t,i)=><Text key={i} style={s.tg}>#{t}</Text>)}</View>
            <View style={s.cf}><Text style={s.ca}>Open</Text><Text style={[s.ca,{color:colors.text.tertiary}]}>Save</Text></View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={searched ? <Text style={s.empty}>No results. Try different keywords.</Text> : <Text style={s.empty}>Search for learning materials above</Text>}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.background.primary},
  h:{padding:20,paddingBottom:12,flexDirection:"row",justifyContent:"space-between",alignItems:"baseline"},
  brand:{...typography.brand,color:colors.text.primary},
  date:{...typography.caption,color:colors.text.tertiary},
  sb:{paddingHorizontal:20,paddingBottom:12},
  si:{backgroundColor:"#fff",borderRadius:12,padding:12,paddingHorizontal:16,fontSize:15,color:colors.text.primary,borderWidth:1,borderColor:colors.border.default},
  list:{paddingHorizontal:20},
  card:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,padding:14,marginBottom:10},
  cardFt:{backgroundColor:"#FBF7F0",borderColor:colors.border.strong},
  ch:{flexDirection:"row",alignItems:"center",gap:6,marginBottom:8},
  sc:{paddingHorizontal:8,paddingVertical:2,borderRadius:5,backgroundColor:colors.accent.goldDim},
  scHi:{backgroundColor:"#E8F0E2"},
  scT:{fontSize:10,fontWeight:"700",color:colors.accent.gold},
  src:{fontSize:11,color:colors.text.tertiary,flex:1},
  tt:{...typography.h3,color:colors.text.primary,marginBottom:6},
  sum:{fontSize:12,color:colors.text.secondary,lineHeight:18,marginBottom:8},
  tgs:{flexDirection:"row",flexWrap:"wrap",gap:4,marginBottom:8},
  tg:{fontSize:10,padding:3,8,paddingHorizontal:8,backgroundColor:colors.background.primary,borderRadius:4,color:colors.text.secondary},
  cf:{flexDirection:"row",gap:16,paddingTop:6,borderTopWidth:1,borderTopColor:colors.border.default},
  ca:{fontSize:12,fontWeight:"500",color:colors.accent.secondary},
  empty:{textAlign:"center",padding:40,color:colors.text.tertiary,fontSize:13},
});
