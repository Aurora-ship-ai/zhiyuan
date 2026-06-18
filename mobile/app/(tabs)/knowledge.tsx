import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { FileText, Clock, Lightbulb, Layers, Search } from "lucide-react-native";
import { searchKnowledge } from "../../services/api";
import type { KnowledgeEntry } from "../../types";

export default function KnowledgeScreen() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [entries] = useState<KnowledgeEntry[]>([]);

  return (
    <SafeAreaView style={s.ctr}>
      <View style={s.h}><Text style={s.brand}>知识库</Text><Text style={s.date}>6月18日</Text></View>
      <View style={s.stats}>
        <Stat num={4} label="笔记" />
        <Stat num={8} label="标签" />
        <Stat num={10} label="卡片" />
      </View>
      <View style={s.searchWrap}>
        <Search size={18} color={colors.text.tertiary} />
        <Text style={s.searchInput}>搜索笔记…</Text>
      </View>
      <View style={s.tagRow}>
        {["Agent","AI","架构设计","编程","系统设计"].map(t=>(<Tag key={t} label={t} selected={activeTags.includes(t)} onPress={()=>{}} />))}
      </View>
      <View style={s.empty}><Text style={s.emptyTitle}>知识库即将就绪</Text><Text style={s.emptyDesc}>笔记保存和检索功能已完成服务端开发{"\n"}打开 docs/knowledge-demo.html 试用完整体验</Text></View>
    </SafeAreaView>
  );
}

function Stat({num,label}:{num:number;label:string}){return <View style={s.stat}><Text style={s.statNum}>{num}</Text><Text style={s.statLbl}>{label}</Text></View>}

const s=StyleSheet.create({
  ctr:{flex:1,backgroundColor:colors.background.primary},
  h:{flexDirection:"row",alignItems:"baseline",justifyContent:"space-between",paddingHorizontal:20,paddingTop:24,paddingBottom:16},
  brand:{...typography.brand,color:colors.text.primary},
  date:{...typography.caption,color:colors.text.tertiary},
  stats:{flexDirection:"row",gap:20,paddingHorizontal:20,paddingBottom:16},
  stat:{alignItems:"center"},
  statNum:{fontFamily:"Georgia",fontSize:24,fontWeight:"700",color:colors.accent.primary},
  statLbl:{fontSize:11,color:colors.text.tertiary,marginTop:2},
  searchWrap:{flexDirection:"row",alignItems:"center",backgroundColor:"#fff",borderRadius:14,paddingHorizontal:18,height:48,marginHorizontal:20,borderWidth:1,borderColor:colors.border.default},
  searchInput:{...typography.body,color:colors.text.tertiary,marginLeft:10},
  tagRow:{flexDirection:"row",flexWrap:"wrap",gap:6,padding:12, paddingHorizontal:20},
  empty:{alignItems:"center",paddingTop:48,paddingHorizontal:32},
  emptyTitle:{...typography.h3,color:colors.text.secondary,marginBottom:8},
  emptyDesc:{...typography.bodySmall,color:colors.text.tertiary,textAlign:"center",lineHeight:22},
});
