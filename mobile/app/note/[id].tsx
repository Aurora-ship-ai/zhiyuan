import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Tag } from "../../components/ui/Tag";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { generateNote } from "../../services/api";
import type { NoteGenerateResponse, KeyConcept, CardItem } from "../../types";

export default function NoteEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gen, setGen] = useState(false);
  const [note, setNote] = useState<NoteGenerateResponse | null>(null);
  const [tab, setTab] = useState<"note"|"cards"|"mindmap">("note");
  const [ref, setRef] = useState("");

  const doGen = async () => {
    setGen(true);
    try {
      const r = await generateNote({
        material_title: "Building Effective Agents",
        material_content: "AI Agent构建核心原则。Tool Use让LLM调用外部API。Workflow编排多步骤。Multi-Agent协作。从最简单开始，大多数场景Prompt+Tool Use足够。高风险操作需人工审核。",
      });
      setNote(r);
    } finally { setGen(false); }
  };

  if (gen) return (<SafeAreaView style={S.container}><View style={S.ct}><Text style={S.gt}>AI分析中…</Text><Text style={S.gs}>提取逻辑、概念与问题</Text><View style={{marginTop:24}}><CardSkeleton/><View style={{height:12}}/><CardSkeleton/></View></View></SafeAreaView>);

  if (!note) return (
    <SafeAreaView style={S.container}>
      <View style={S.hero}><Text style={S.hT}>复习笔记</Text><Text style={S.hS}>AI将资料转化为结构化深度笔记</Text><View style={S.mr}><Text style={S.ml}>资料来源</Text><Text style={S.mn}>Building Effective Agents</Text></View><Button title="生成复习笔记" onPress={doGen} style={{marginTop:16}}/></View>
    </SafeAreaView>
  );

  return (<SafeAreaView style={S.container}><ScrollView contentContainerStyle={S.ct}>
    <View style={S.me}><Text style={S.ml}>资料来源</Text><Text style={S.mn}>{note.material_title}</Text><Text style={S.mt}>{note.took_ms}ms</Text></View>
    <View style={S.tr}>{(["note","cards","mindmap"]as const).map(t=>(<TouchableOpacity key={t} style={[S.tb,tab===t&&S.ta]} onPress={()=>setTab(t)}><Text style={[S.tt,tab===t&&S.ttA]}>{t==="note"?"笔记":t==="cards"?"卡片":"导图"}</Text></TouchableOpacity>))}</View>
    {tab==="note"&&<>
      <Card style={S.se}><Text style={S.st}>核心逻辑链</Text><Text style={S.lt}>{note.logic_chain}</Text></Card>
      <Card style={S.se}><Text style={S.st}>关键概念</Text>{note.key_concepts.map((c:KeyConcept,i:number)=>(<View key={i} style={S.ci}><Text style={S.cT}>{c.term}</Text><Text style={S.cD}>{c.definition}</Text></View>))}</Card>
      <Card style={S.se}><Text style={S.st}>延伸思考</Text>{note.extension_questions.map((q:string,i:number)=>(<View key={i} style={S.qi}><Text style={S.qp}>?</Text><Text style={S.qt}>{q}</Text></View>))}</Card>
      <Card style={S.se}><Text style={S.st}>我的理解</Text><Input value={ref} onChangeText={setRef} placeholder="写下你的理解…" multiline/></Card>
      {note.tags.length>0&&<View style={S.tr2}>{note.tags.map((t:string)=>(<Tag key={t} label={t}/>))}</View>}
    </>}
    {tab==="cards"&&<View style={{gap:12}}>{note.cards.map((c:CardItem,i:number)=>(<Card key={i} style={S.cd}><Text style={S.cQ}>Q: {c.question}</Text><View style={S.cDv}/><Text style={S.cA}>A: {c.answer}</Text></Card>))}</View>}
    {tab==="mindmap"&&<Card style={S.se}><Text style={S.st}>思维导图</Text><MP d={note.mindmap}/></Card>}
    <Button title="保存笔记" onPress={()=>{}} variant="secondary" style={{marginTop:24}}/>
    <View style={{height:48}}/>
  </ScrollView></SafeAreaView>);
}

function MP({d}:{d?:Record<string,unknown>}){
  if(!d)return<Text style={S.em}>暂无</Text>;
  const r=d.root as string;const c=d.children as any[];
  return<View><Text style={S.mmR}>● {r}</Text>{c?.map((x,i)=>(<View key={i} style={{marginLeft:16,marginTop:8}}><Text style={S.mmB}>├ {x.name}</Text>{x.children?.map((y:any,j:number)=>(<Text key={j} style={S.mmL}>│  └ {y.name}</Text>))}</View>))}</View>;
}

const S=StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background.primary},
  ct:{paddingHorizontal:20,paddingTop:20,paddingBottom:48},
  hero:{padding:20,paddingTop:48,alignItems:"center"},
  hT:{...typography.brand,color:colors.text.primary,marginBottom:8},hS:{...typography.bodySmall,color:colors.text.secondary,textAlign:"center",marginBottom:24,lineHeight:22},
  mr:{backgroundColor:colors.background.card,borderRadius:10,padding:16,width:"100%",borderWidth:1,borderColor:colors.border.default},
  ml:{...typography.caption,color:colors.text.tertiary,marginBottom:4},mn:{...typography.bodySmall,color:colors.accent.secondary,fontWeight:"500"},
  mt:{...typography.caption,color:colors.text.tertiary},
  gt:{...typography.h2,color:colors.text.primary,textAlign:"center",marginTop:48},gs:{...typography.bodySmall,color:colors.text.tertiary,textAlign:"center"},
  me:{marginBottom:24,paddingBottom:20,borderBottomWidth:1,borderBottomColor:colors.border.default},
  tr:{flexDirection:"row",gap:8,marginBottom:20},
  tb:{paddingHorizontal:20,paddingVertical:8,borderRadius:24,backgroundColor:colors.background.card},
  ta:{backgroundColor:colors.accent.primary},tt:{...typography.caption,fontWeight:"500",color:colors.text.secondary},ttA:{color:colors.text.inverse},
  se:{marginBottom:20,gap:12},st:{...typography.h3,color:colors.text.primary},
  lt:{...typography.body,color:colors.text.primary,lineHeight:26},
  ci:{marginBottom:12},cT:{...typography.bodySmall,color:colors.accent.primary,fontWeight:"600",marginBottom:2},cD:{...typography.bodySmall,color:colors.text.secondary,lineHeight:21},
  qi:{flexDirection:"row",gap:8,marginBottom:12},qp:{fontSize:16,lineHeight:24},qt:{...typography.bodySmall,color:colors.text.primary,flex:1,lineHeight:22},
  tr2:{flexDirection:"row",flexWrap:"wrap",gap:4},
  cd:{gap:6},cQ:{...typography.bodySmall,color:colors.text.primary,fontWeight:"500"},cDv:{height:1,backgroundColor:colors.border.default},cA:{...typography.bodySmall,color:colors.accent.secondary},
  mmR:{...typography.body,color:colors.accent.primary,fontWeight:"700"},mmB:{...typography.bodySmall,color:colors.text.primary,fontWeight:"600"},mmL:{...typography.caption,color:colors.text.secondary,marginLeft:16,marginTop:4},
  em:{...typography.bodySmall,color:colors.text.tertiary,textAlign:"center",paddingVertical:24},
});