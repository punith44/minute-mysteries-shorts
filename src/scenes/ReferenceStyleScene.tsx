import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Presenter, type PresenterPose} from "../components/Presenter";
import {COLORS} from "../theme/colors";
import {FONTS} from "../theme/fonts";
import {SPRING_PRESETS} from "../theme/transitions";

export type ReferenceSceneData = {
  number: string;
  label: string;
  counter: string;
  title: React.ReactNode;
  visual: "claim" | "weight" | "seal" | "fans" | "thruster" | "warning" | "verdict";
  pose: PresenterPose;
};

const MiniHeader: React.FC<{data: ReferenceSceneData}> = ({data}) => (
  <div style={{position: "absolute", top: 38, left: 44, right: 44, display: "flex", justifyContent: "space-between", fontFamily: FONTS.sans, fontSize: 10, color: "#6f6b65", letterSpacing: "0.08em", fontWeight: 700}}>
    <span>// {data.number} · {data.label}</span><span>{data.counter}</span>
  </div>
);

const Roadster: React.FC<{inverted?: boolean; frame: number}> = ({inverted, frame}) => {
  const bob = Math.sin(frame / 5) * 2;
  return <div style={{transform: `rotate(${inverted ? 180 : 0}deg) translateY(${bob}px)`, width: 390, height: 150, position: "relative"}}>
    <svg width="390" height="150" viewBox="0 0 390 150">
      <path d="M28 106 C45 104 61 81 93 75 L180 42 C225 31 274 46 311 74 L361 96 C376 100 379 110 360 112 L49 112 C32 112 22 110 28 106Z" fill="#fbfaf6" stroke={COLORS.ink} strokeWidth="4" />
      <path d="M161 70 L201 48 C231 44 258 52 286 75Z" fill="#1d1d1d" />
      <path d="M75 99 L317 99" stroke={COLORS.signalRed} strokeWidth="3" />
      <circle cx="83" cy="112" r="25" fill={COLORS.ink}/><circle cx="83" cy="112" r="13" fill="#e8e4da"/><circle cx="83" cy="112" r="5" fill={COLORS.signalRed}/>
      <circle cx="304" cy="112" r="25" fill={COLORS.ink}/><circle cx="304" cy="112" r="13" fill="#e8e4da"/><circle cx="304" cy="112" r="5" fill={COLORS.signalRed}/>
      <rect x="107" y="108" width="165" height="8" rx="3" fill="#202020"/>
    </svg>
  </div>;
};

const Visual: React.FC<{kind: ReferenceSceneData["visual"]; frame: number}> = ({kind, frame}) => {
  const pulse = 1 + Math.sin(frame / 6) * 0.025;
  const card: React.CSSProperties = {background: "#fbfaf6", border: "2px solid #171717", borderRadius: 14, boxShadow: "7px 8px 0 rgba(17,17,17,.15), 10px 12px 0 rgba(17,17,17,.05)", transform: `scale(${pulse})`};
  if (kind === "claim") return <div style={{...card, width: 510, height: 265, display: "grid", placeItems: "center", overflow: "hidden"}}><div style={{position:"absolute", top:16, left:20, fontFamily:FONTS.sans, fontSize:11, color:"#777"}}>roadster.demo / ceiling test</div><Roadster inverted frame={frame}/><div style={{position:"absolute", bottom:21, background:COLORS.signalRed, color:"white", padding:"8px 17px", borderRadius:18, fontFamily:FONTS.sans, fontWeight:800, fontSize:15}}>UPSIDE-DOWN?</div></div>;
  if (kind === "weight") return <div style={{...card, width: 490, height: 250, display:"flex", alignItems:"center", justifyContent:"space-around"}}><div style={{fontFamily:FONTS.sans, fontSize:62, fontWeight:900, color:COLORS.signalRed}}>3,820<span style={{fontSize:22, color:COLORS.ink}}> lb</span></div><div style={{fontSize:92, color:COLORS.signalRed, transform:`translateY(${Math.sin(frame / 4) * 5}px)`}}>↓</div></div>;
  if (kind === "seal") return <div style={{...card, width: 510, height: 250, position:"relative", overflow:"hidden"}}><div style={{position:"absolute", left:40,right:40,top:42,height:17,background:COLORS.ink}}/><div style={{position:"absolute",left:105,right:105,top:104,height:82,border:"3px solid #111",borderTop:"none",background:"rgba(232,64,42,.14)"}}/><div style={{position:"absolute",left:91,top:57,width:19,height:133,background:COLORS.signalRed,border:"2px solid #111"}}/><div style={{position:"absolute",right:91,top:57,width:19,height:133,background:COLORS.signalRed,border:"2px solid #111"}}/><div style={{position:"absolute",top:126,left:0,right:0,textAlign:"center",fontFamily:FONTS.sans,fontWeight:800,fontSize:19,color:COLORS.signalRed}}>SEALED AIR POCKET</div></div>;
  if (kind === "fans") return <div style={{display:"flex", gap:28}}>{[1,-1].map((dir) => <div key={dir} style={{...card,width:210,height:210,display:"grid",placeItems:"center"}}><div style={{width:136,height:136,borderRadius:"50%",border:"5px solid #111",background:`repeating-conic-gradient(#111 0 12deg, #e8402a 12deg 17deg, #f8f5ee 17deg 30deg)`,transform:`rotate(${frame * dir * 16}deg)`}}/><span style={{position:"absolute",fontFamily:FONTS.sans,fontWeight:900,fontSize:17,color:COLORS.signalRed}}>25K RPM</span></div>)}</div>;
  if (kind === "thruster") return <div style={{...card,width:510,height:235,display:"grid",placeItems:"center",overflow:"hidden"}}><Roadster frame={frame}/><div style={{position:"absolute",left:20,top:105,width:120,height:42,background:"rgba(2,132,199,.4)",clipPath:"polygon(100% 0, 100% 100%, 0 72%, 14% 50%, 0 28%)"}}/><div style={{position:"absolute",bottom:18,fontFamily:FONTS.sans,fontWeight:900,color:COLORS.techCyan}}>10,000 PSI · COLD GAS</div></div>;
  if (kind === "warning") return <div style={{...card,width:510,height:245,display:"grid",placeItems:"center",background:"#fff4f1"}}><div style={{fontSize:104, lineHeight:1}}>⚠</div><div style={{position:"absolute",bottom:31,fontFamily:FONTS.sans,fontWeight:900,fontSize:23,color:COLORS.signalRed}}>ONE PEBBLE BREAKS THE SEAL</div></div>;
  return <div style={{...card,width:510,height:245,display:"grid",placeItems:"center"}}><Roadster inverted frame={frame}/><div style={{position:"absolute",bottom:22,fontFamily:FONTS.sans,fontWeight:900,fontSize:21}}>ACTIVE SUCTION + AEROSPACE FORCE</div></div>;
};

export const ReferenceStyleScene: React.FC<{data: ReferenceSceneData}> = ({data}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: SPRING_PRESETS.snappy});
  const headlineY = interpolate(enter, [0, 1], [20, 0]);
  return <AbsoluteFill style={{backgroundColor:"#f1eee7", overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,opacity:.26,backgroundImage:"radial-gradient(#aaa 0.6px, transparent 0.7px)",backgroundSize:"4px 4px"}}/>
    <MiniHeader data={data}/>
    <div style={{position:"absolute",top:105,left:44,right:36,fontFamily:FONTS.sans,fontWeight:700,fontSize:44,lineHeight:1.02,letterSpacing:"-0.045em",transform:`translateY(${headlineY}px)`,opacity:enter}}>{data.title}</div>
    <div style={{position:"absolute",top:330,left:"50%",transform:`translateX(-50%) scale(${enter})`,transformOrigin:"center"}}><Visual kind={data.visual} frame={frame}/></div>
    <div style={{position:"absolute",bottom:-18,right:-12,filter:"drop-shadow(-6px -5px 0 rgba(17,17,17,.1))"}}><Presenter pose={data.pose} scale={0.55}/></div>
  </AbsoluteFill>;
};
