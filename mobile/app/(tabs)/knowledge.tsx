import React, { useState } from "react";
// TODO: re-add icons via @expo/vector-icons
import { searchKnowledge } from "../../services/api";
import type { KnowledgeEntry } from "../../types";

export default function KnowledgeScreen() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [entries] = useState<KnowledgeEntry[]>([]);

  return (
    <SafeAreaView style={s.ctr}>
      <View style={s.h}><Text style={s.brand}>閻儴鐦戞惔?/Text><Text style={s.date}>6閺?8閺?/Text></View>
      <View style={s.stats}>
        <Stat num={4} label="缁楁棁顔? />
        <Stat num={8} label="閺嶅洨顒? />
        <Stat num={10} label="閸楋紕澧? />
      </View>
      <View style={s.searchWrap}>
        <Search size={18} color={colors.text.tertiary} />
        <Text style={s.searchInput}>閹兼粎鍌ㄧ粭鏃囶唶閳?/Text>
      </View>
      <View style={s.tagRow}>
        {["Agent","AI","閺嬭埖鐎拋鎹愵吀","缂傛牜鈻?,"缁崵绮虹拋鎹愵吀"].map(t=>(<Tag key={t} label={t} selected={activeTags.includes(t)} onPress={()=>{}} />))}
      </View>
      <View style={s.empty}><Text style={s.emptyTitle}>閻儴鐦戞惔鎾冲祮鐏忓棗姘ㄧ紒?/Text><Text style={s.emptyDesc}>缁楁棁顔囨穱婵嗙摠閸滃本顥呯槐銏犲閼宠棄鍑＄€瑰本鍨氶張宥呭缁旑垰绱戦崣鎲?\n"}閹垫挸绱?docs/knowledge-demo.html 鐠囨洜鏁ょ€瑰本鏆ｆ担鎾荤崣</Text></View>
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
