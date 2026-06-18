import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Tag } from "../../components/ui/Tag";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { generateNote } from "../../services/api";
import type { NoteGenerateResponse, KeyConcept, CardItem } from "../../types";

export default function NoteEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gen, setGen] = useState(false);
  const [note, setNote] = useState<NoteGenerateResponse | null>(null);
  const [tab, setTab] = useState<"note" | "cards" | "mindmap">("note");
  const [ref, setRef] = useState("");
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

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

  const toggleFlip = (i: number) => {
    const next = new Set(flipped);
    next.has(i) ? next.delete(i) : next.add(i);
    setFlipped(next);
  };

  // ====== 加载态 ======
  if (gen) return (
    <SafeAreaView style={S.ctr}>
      <Nav title="生成中…" />
      <View style={S.loadHero}>
        <View style={S.loadSpinner} />
        <Text style={S.loadTitle}>AI 正在深度分析资料</Text>
        <Text style={S.loadSub}>提取逻辑链、识别关键概念…</Text>
        <View style={S.loadSteps}>
          {["解析文章结构","提取核心逻辑链","识别关键概念","生成延伸问题","构建卡片与导图"].map((s,i)=>(<View key={i} style={S.loadStep}><View style={[S.loadDot,{backgroundColor:colors.accent.secondaryDim}]}/><Text style={S.loadStepText}>{s}</Text></View>))}
        </View>
      </View>
    </SafeAreaView>
  );

  // ====== 初始页 ======
  if (!note) return (
    <SafeAreaView style={S.ctr}>
      <Nav title="" />
      <View style={S.hero}>
        <Text style={S.heroTitle}>复习笔记</Text>
        <Text style={S.heroSub}>AI 深度解析学习资料，生成结构化复习笔记{"\n"}包含逻辑链、关键概念、延伸问题和问答卡片</Text>
        <View style={S.heroMat}><Text style={S.hmLabel}>资料来源</Text><Text style={S.hmName}>Building Effective Agents</Text><Text style={S.hmSrc}>Anthropic 工程团队</Text></View>
        <Button title="✦ 生成复习笔记" onPress={doGen} style={{ width: "100%", height: 52, borderRadius: 12 }} />
      </View>
    </SafeAreaView>
  );

  // ====== 主笔记 ======
  return (
    <SafeAreaView style={S.ctr}>
      <Nav title="复习笔记" />
      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {/* 封面卡片 */}
        <View style={S.cover}>
          <View style={S.coverAccent} />
          <View style={S.coverInner}>
            <Text style={S.cvLabel}>资料来源</Text>
            <Text style={S.cvTitle}>{note.material_title}</Text>
            <View style={S.cvMeta}><Text style={S.cvMetaText}>📄 Anthropic</Text><Text style={S.cvMetaText}>⏱ {note.took_ms}ms</Text></View>
          </View>
        </View>

        {/* Tab 切换 */}
        <View style={S.tabs}>
          {(["note","cards","mindmap"] as const).map(t=>(
            <TouchableOpacity key={t} style={[S.tb,tab===t&&S.tbOn]} onPress={()=>setTab(t)}>
              <View style={[S.tbDot,tab===t&&S.tbDotOn]} /><Text style={[S.tbTxt,tab===t&&S.tbTxtOn]}>{t==="note"?"笔记":t==="cards"?`问答卡片 · ${note.cards.length}`:"思维导图"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={S.content}>
          {tab === "note" && <>
            {/* 逻辑链 — 步骤编号 */}
            <View style={S.section}>
              <View style={S.secHead}><View style={[S.secIcon,{backgroundColor:colors.accent.dim}]}><Text style={{fontSize:14}}>🔗</Text></View><Text style={S.secTitle}>核心逻辑链</Text></View>
              <View style={S.logicCard}>
                {note.logic_chain.split("→").map((step,i)=>(
                  <View key={i} style={[S.logicStep,i<note.logic_chain.split("→").length-1&&S.logicStepBorder]}>
                    <View style={S.logicNum}><Text style={S.logicNumText}>{i+1}</Text></View>
                    <Text style={S.logicText}>{step.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 关键概念 — 彩色侧边 */}
            <View style={S.section}>
              <View style={S.secHead}><View style={[S.secIcon,{backgroundColor:colors.accent.goldDim}]}><Text style={{fontSize:14}}>💡</Text></View><Text style={S.secTitle}>关键概念</Text></View>
              <View style={S.conceptCard}>
                {note.key_concepts.map((c:KeyConcept,i:number)=>(
                  <View key={i} style={[S.cItem,i<note.key_concepts.length-1&&S.cItemBorder]}>
                    <Text style={S.cTerm}>{c.term}</Text><Text style={S.cDef}>{c.definition}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 延伸思考 — 圆形编号 */}
            <View style={S.section}>
              <View style={S.secHead}><View style={[S.secIcon,{backgroundColor:colors.accent.secondaryDim}]}><Text style={{fontSize:14}}>❓</Text></View><Text style={S.secTitle}>延伸思考</Text></View>
              <View style={S.qCard}>
                {note.extension_questions.map((q:string,i:number)=>(
                  <View key={i} style={[S.qItem,i<note.extension_questions.length-1&&S.qItemBorder]}>
                    <View style={S.qNum}><Text style={S.qNumText}>{i+1}</Text></View><Text style={S.qText}>{q}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 留白区 — 虚线边框 */}
            <View style={S.section}>
              <View style={S.secHead}><View style={[S.secIcon,{backgroundColor:colors.background.elevated}]}><Text style={{fontSize:14}}>✏️</Text></View><Text style={S.secTitle}>我的理解</Text></View>
              <View style={S.refCard}>
                <Text style={S.refPlaceholder}>{ref||"在这里写下你的理解、疑问和联想…"}</Text>
              </View>
            </View>

            {note.tags.length>0&&<View style={S.tagsRow}>{note.tags.map((t:string)=>(<Tag key={t} label={`#${t}`} />))}</View>}
          </>}

          {/* 问答卡片 */}
          {tab === "cards" && <View style={{gap:14}}>
            {note.cards.map((c:CardItem,i:number)=>(
              <TouchableOpacity key={i} style={S.fc} onPress={()=>toggleFlip(i)} activeOpacity={0.95}>
                <View style={S.fcQ}><View style={S.fcQBadge}><Text style={S.fcQBadgeText}>{i+1}</Text></View><Text style={S.fcQText}>{c.question}</Text></View>
                {flipped.has(i) && <View style={S.fcA}><Text style={S.fcAText}>{c.answer}</Text></View>}
                {!flipped.has(i) && <Text style={S.fcHint}>轻触查看答案</Text>}
              </TouchableOpacity>
            ))}
          </View>}

          {/* 思维导图 */}
          {tab === "mindmap" && (
            <View style={S.section}>
              <View style={S.secHead}><View style={[S.secIcon,{backgroundColor:colors.accent.goldDim}]}><Text style={{fontSize:14}}>🗺</Text></View><Text style={S.secTitle}>思维导图</Text></View>
              <View style={S.mm}>
                <Text style={S.mmRoot}>● {note.mindmap?.root as string||""}</Text>
                {(note.mindmap?.children as any[])?.map((br:any,i:number)=>(<View key={i} style={S.mmBr}><Text style={S.mmBrTitle}>└ {br.name}</Text>{br.children?.map((lf:any,j:number)=>(<Text key={j} style={S.mmLf}>· {lf.name}</Text>))}</View>))}
              </View>
            </View>
          )}

          {/* 底部操作 */}
          <View style={S.bottomBar}>
            <Button title="保存笔记" onPress={()=>{}} style={{flex:1}} />
            <Button title="重新生成" onPress={()=>{setNote(null)}} variant="secondary" style={{flex:"0 0 auto",paddingHorizontal:18}} />
          </View>
        </View>
        <View style={{height:40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

function Nav({title}:{title:string}){
  return <View style={S.nav}><View style={{flexDirection:"row",alignItems:"center",gap:6}}><Text style={S.navBack}>← 返回</Text></View><Text style={S.navTitle}>{title}</Text><View style={{width:60}}/></View>;
}

const S = StyleSheet.create({
  ctr:{flex:1,backgroundColor:colors.background.primary},
  nav:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:"transparent"},
  navBack:{fontSize:15,fontWeight:"500",color:colors.accent.secondary},
  navTitle:{fontFamily:"Georgia",fontSize:17,fontWeight:"600",color:colors.text.primary},
  scroll:{paddingBottom:60},
  // 封面
  cover:{flexDirection:"row",marginHorizontal:20,marginBottom:16,borderRadius:10,borderWidth:1,borderColor:colors.border.default,backgroundColor:"#FDFAF5",overflow:"hidden",...colors.shadow.md},
  coverAccent:{width:3,backgroundColor:colors.accent.primary},
  coverInner:{flex:1,padding:20},
  cvLabel:{fontSize:11,fontWeight:"600",color:colors.accent.primary,letterSpacing:0.5,marginBottom:8,textTransform:"uppercase"},
  cvTitle:{fontFamily:"Georgia",fontSize:22,fontWeight:"700",color:colors.text.primary,lineHeight:30,marginBottom:8},
  cvMeta:{flexDirection:"row",gap:12},
  cvMetaText:{fontSize:12,color:colors.text.tertiary},
  // Tabs
  tabs:{flexDirection:"row",gap:4,paddingHorizontal:20,paddingBottom:16},
  tb:{flexDirection:"row",alignItems:"center",gap:6,paddingHorizontal:18,paddingVertical:9,borderRadius:24,borderWidth:1,borderColor:colors.border.default},
  tbOn:{backgroundColor:colors.accent.primary,borderColor:colors.accent.primary},
  tbDot:{width:5,height:5,borderRadius:3,backgroundColor:colors.text.tertiary},
  tbDotOn:{backgroundColor:"rgba(255,255,255,0.6)"},
  tbTxt:{fontSize:13,fontWeight:"500",color:colors.text.secondary},
  tbTxtOn:{color:colors.text.inverse,fontWeight:"600"},
  // 内容
  content:{paddingHorizontal:20},
  section:{marginBottom:20},
  secHead:{flexDirection:"row",alignItems:"center",gap:10,marginBottom:14},
  secIcon:{width:30,height:30,borderRadius:8,alignItems:"center",justifyContent:"center"},
  secTitle:{fontFamily:"Georgia",fontSize:16,fontWeight:"600",color:colors.text.primary},
  // 逻辑链
  logicCard:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,overflow:"hidden"},
  logicStep:{flexDirection:"row",gap:14,padding:14},
  logicStepBorder:{borderBottomWidth:1,borderBottomColor:colors.border.default},
  logicNum:{width:26,height:26,borderRadius:13,backgroundColor:colors.accent.primary,alignItems:"center",justifyContent:"center"},
  logicNumText:{fontSize:12,fontWeight:"700",color:"#fff"},
  logicText:{fontSize:14,color:colors.text.primary,lineHeight:23,flex:1},
  // 概念
  conceptCard:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,overflow:"hidden"},
  cItem:{padding:14,paddingLeft:13,borderLeftWidth:3,borderLeftColor:colors.accent.primary},
  cItemBorder:{borderBottomWidth:1,borderBottomColor:colors.border.default},
  cTerm:{fontSize:14,fontWeight:"700",color:colors.accent.primary,marginBottom:3},
  cDef:{fontSize:13,color:colors.text.secondary,lineHeight:21},
  // 问题
  qCard:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,overflow:"hidden"},
  qItem:{flexDirection:"row",gap:12,padding:14,alignItems:"flex-start"},
  qItemBorder:{borderBottomWidth:1,borderBottomColor:colors.border.default},
  qNum:{width:22,height:22,borderRadius:11,backgroundColor:colors.accent.secondaryDim,alignItems:"center",justifyContent:"center"},
  qNumText:{fontSize:11,fontWeight:"700",color:colors.accent.secondary},
  qText:{fontSize:14,color:colors.text.primary,lineHeight:22,flex:1},
  // 留白
  refCard:{backgroundColor:"#FBF8F2",borderRadius:10,borderWidth:2,borderColor:colors.border.default,borderStyle:"dashed",padding:18},
  refPlaceholder:{fontFamily:"Georgia",fontSize:15,color:colors.text.tertiary,fontStyle:"italic",lineHeight:26},
  // 卡片
  fc:{backgroundColor:"#FDFAF5",borderRadius:10,borderWidth:1,borderColor:colors.border.default,overflow:"hidden",...colors.shadow.sm},
  fcQ:{padding:18,flexDirection:"row",gap:10,alignItems:"flex-start"},
  fcQBadge:{width:24,height:24,borderRadius:6,backgroundColor:colors.accent.primary,alignItems:"center",justifyContent:"center"},
  fcQBadgeText:{fontSize:12,fontWeight:"700",color:"#fff"},
  fcQText:{fontSize:15,color:colors.text.primary,fontWeight:"600",lineHeight:22,paddingTop:2,flex:1},
  fcA:{paddingHorizontal:18,paddingBottom:18,paddingLeft:52},
  fcAText:{fontSize:14,color:colors.accent.secondary,lineHeight:23,padding:14,backgroundColor:colors.accent.secondaryDim,borderRadius:8},
  fcHint:{textAlign:"center",fontSize:11,color:colors.text.tertiary,paddingBottom:12},
  // 导图
  mm:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,padding:20},
  mmRoot:{fontSize:16,fontWeight:"700",color:colors.accent.primary,marginBottom:16},
  mmBr:{marginLeft:24,marginBottom:14},
  mmBrTitle:{fontSize:14,fontWeight:"600",color:colors.text.primary,marginBottom:6},
  mmLf:{fontSize:13,color:colors.text.secondary,marginLeft:8,marginBottom:3},
  // 标签
  tagsRow:{flexDirection:"row",flexWrap:"wrap",gap:6},
  // 底部
  bottomBar:{flexDirection:"row",gap:10,marginTop:24},
  // Load / Hero
  loadHero:{padding:80,alignItems:"center"},
  loadSpinner:{width:44,height:44,borderRadius:22,borderWidth:3,borderColor:colors.background.elevated,borderTopColor:colors.accent.primary,marginBottom:20},
  loadTitle:{fontFamily:"Georgia",fontSize:17,color:colors.text.primary,marginBottom:6},
  loadSub:{fontSize:13,color:colors.text.tertiary},
  loadSteps:{marginTop:32,alignSelf:"stretch"},
  loadStep:{flexDirection:"row",alignItems:"center",gap:10,marginBottom:10},
  loadDot:{width:8,height:8,borderRadius:4},
  loadStepText:{fontSize:13,color:colors.text.tertiary},
  hero:{padding:24,paddingTop:56,alignItems:"center"},
  heroTitle:{...typography.brand,color:colors.text.primary,marginBottom:10},
  heroSub:{...typography.bodySmall,color:colors.text.secondary,textAlign:"center",marginBottom:28,lineHeight:22},
  heroMat:{backgroundColor:colors.background.card,borderRadius:10,borderWidth:1,borderColor:colors.border.default,padding:16,width:"100%",marginBottom:24,flexDirection:"row",alignItems:"center",gap:12},
  hmLabel:{fontSize:11,color:colors.text.tertiary,marginBottom:4},
  hmName:{fontSize:14,color:colors.text.primary,fontWeight:"600"},
  hmSrc:{fontSize:12,color:colors.text.tertiary},
});