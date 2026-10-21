import { useState, useMemo, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA4sJvUkofJt1u61MEC-4JSkUKSN9pBEI8",
  authDomain: "dpl-padel-site.firebaseapp.com",
  databaseURL: "https://dpl-padel-site-default-rtdb.firebaseio.com",
  projectId: "dpl-padel-site",
  storageBucket: "dpl-padel-site.appspot.com",
  messagingSenderId: "884760946899",
  appId: "1:884760946899:web:73035c5289adba435ecc26"
};

let db = null;
try { const app = initializeApp(firebaseConfig); db = getDatabase(app); } catch(e) { console.warn("Firebase init failed:", e); }

const LOGO_SQUARE_URL = "https://i.imgur.com/p6qJIP1.jpeg";
const LOGO_BANNER_URL = "https://i.imgur.com/dUkcrm5.jpeg";

const C = {
  bg:"#0a0a0f", card:"#12121a", border:"#1e1e2e", accent:"#00d4ff",
  gold:"#ffd700", silver:"#c0c0c0", bronze:"#cd7f32",
  green:"#00e676", red:"#ff5252", muted:"#6b7280", text:"#e2e8f0",
  surface:"#16162a", purple:"#7c3aed", orange:"#f97316",
  s4accent:"#f97316", // Season 4 accent — burnt orange
};

// ── SEASON 4 SCHEDULE ──────────────────────────────────────────────────────
const S4_SCHEDULE = [
  { week:1, date:"08 Sep 2026", matches:[
    { p1:"Brandon", p2:"Byron",   p3:"Graeme",  p4:"Darren",  scores:["6-4","6-1","6-3"], result:[3,0], w:1 },
    { p1:"Keagan",  p2:"Michael", p3:"Connor",  p4:"John",    scores:["6-3","7-6","6-3"], result:[3,0], w:1 },
  ]},
  { week:2, date:"15 Sep 2026", matches:[
    { p1:"Connor",  p2:"Keagan",  p3:"Michael", p4:"Byron",  scores:["6-4","3-6","6-2"], result:[2,1], w:1 },
    { p1:"Darren",  p2:"Brandon", p3:"Graeme",  p4:"John",   scores:["6-1","6-2","6-4"], result:[3,0], w:1 },
  ]},
  { week:3, date:"22 Sep 2026", matches:[
    { p1:"Michael", p2:"Keagan",  p3:"Glenn",   p4:"Nathan",  scores:["6-3","6-2","1-6"], result:[2,1], w:1 },
    { p1:"Darren",  p2:"Brandon", p3:"John",    p4:"Byron",   scores:["6-3","6-3","7-6"], result:[3,0], w:1 },
  ]},
  { week:4, date:"29 Sep 2026", matches:[
    { p1:"Byron",   p2:"Graeme",  p3:"Darren",  p4:"Keagan",  scores:["7-5","6-7","6-4"], result:[2,1], w:1 },
    { p1:"Michael", p2:"Connor",  p3:"Brandon", p4:"John",    scores:["6-4","7-6","6-4"], result:[3,0], w:1 },
  ]},
  { week:5, date:"06 Oct 2026", matches:[
    { p1:"Darren",  p2:"Byron",   p3:"John",    p4:"Keagan",  scores:["7-5","6-3","2-6"], result:[2,1], w:1 },
    { p1:"Brandon", p2:"Connor",  p3:"Michael", p4:"Graeme",  scores:["6-4","7-6","2-6"], result:[2,1], w:1 },
  ]},
  { week:6, date:"13 Oct 2026", matches:[
    { p1:"John",    p2:"Byron",   p3:"Connor",  p4:"Graeme",  scores:["3-6","6-1","6-2"], result:[2,1], w:1 },
    { p1:"Michael", p2:"Nathan",  p3:"Brandon", p4:"Keagan",  scores:["6-4","7-5","6-2"], result:[3,0], w:1 },
  ]},
  { week:7, date:"20 Oct 2026", matches:[
    { p1:"Graeme",  p2:"Keagan",  p3:"Darren",  p4:"John",    scores:null },
    { p1:"Byron",   p2:"Connor",  p3:"Brandon", p4:"Michael", scores:null },
  ]},
];

// ── S4 PLAYERS ─────────────────────────────────────────────────────────────
const S4_PLAYERS = ["Brandon","Byron","Connor","Darren","Graeme","John","Keagan","Michael","Glenn","Nathan"];

// ── SEASON 3 DATA ──────────────────────────────────────────────────────────
const TEAMS = [
  { id:"t1", name:"Overhead Casualties", color:"#00d4ff", p1:"Brandon", p2:"Graeme",  emoji:"💥" },
  { id:"t2", name:"Circumserve",         color:"#ffd700", p1:"Byron",   p2:"Keagan",  emoji:"🌀" },
  { id:"t3", name:"One Nice Guy",        color:"#00e676", p1:"John",    p2:"Michael", emoji:"😇" },
  { id:"t4", name:"EFF",                 color:"#ff5252", p1:"Darren",  p2:"Connor",  emoji:"🔥" },
  { id:"t5", name:"The Benchwarmers",    color:"#a78bfa", p1:"Nathan",  p2:"Brett",   emoji:"🪑" },
];

const S3_SCHEDULE = [
  { round:1,   date:"14 Jul 2026", matches:[
    { t1:"t1", t2:"t2", scores:["6-4","5-7","4-6"], result:[2,1] },
    { t1:"t4", t2:"t3", scores:["3-6","6-2","6-3"], result:[2,1] },
  ]},
  { round:2,   date:"21 Jul 2026", matches:[
    { t1:"t3", t2:"t1", scores:["6-3","7-5","6-4"], result:[2,0] },
    { t1:"t4", t2:"t2", scores:["6-4","7-5","7-5"], result:[2,0] },
  ]},
  { round:3,   date:"30 Jul 2026", matches:[
    { t1:"t4", t2:"t1", scores:["6-3","6-3","6-3"], result:[2,0] },
    { t1:"t2", t2:"t5", scores:["7-6","1-6","7-5"], result:[2,1], forfeit:true },
  ]},
  { round:4,   date:"05 Aug 2026", matches:[
    { t1:"t2", t2:"t4", scores:["6-3","6-4","7-6"], result:[2,0] },
    { t1:"t3", t2:"t1", scores:["6-7","6-1","6-1"], result:[2,1] },
  ]},
  { round:5,   date:"12 Aug 2026", matches:[
    { t1:"t4", t2:"t1", scores:["7-6","6-4","7-6"], result:[2,0] },
    { t1:"t3", t2:"t2", scores:["6-1","6-2","7-5"], result:[2,0] },
  ]},
  { round:6,   date:"19 Aug 2026", matches:[
    { t1:"t2", t2:"t1", scores:["6-4","7-6","6-3"], result:[2,0] },
    { t1:"t3", t2:"t4", scores:["6-3","6-1","6-3"], result:[2,0] },
  ]},
  { round:"SF",date:"26 Aug 2026", matches:[
    { t1:"t2", t2:"t4", scores:["7-6","6-4"],       result:[2,0] },
    { t1:"t1", t2:"t3", scores:["7-5","6-4","6-4"], result:[2,1] },
  ]},
  { round:"GF",date:"02 Sep 2026", matches:[
    { t1:"t2", t2:"t1", scores:["6-4","4-6","6-3"], result:[2,1] },
    { t1:"t3", t2:"t4", scores:["7-6","6-7","6-4"], result:[2,1] },
  ]},
];

const SEASON1 = [
  { week:1,  date:"03 Mar 2026", p1:"Keagan",  p2:"Brandon", p3:"Connor",  p4:"Byron",   s:[6,1,7,6,3,6], w:1 },
  { week:1,  date:"03 Mar 2026", p1:"Graeme",  p2:"Michael", p3:"Darren",  p4:"John",    s:[6,3,2,6,6,1], w:1 },
  { week:2,  date:"10 Mar 2026", p1:"Graeme",  p2:"Byron",   p3:"Keagan",  p4:"John",    s:[6,1,1,6,6,2], w:1 },
  { week:2,  date:"10 Mar 2026", p1:"Connor",  p2:"Brandon", p3:"Darren",  p4:"Michael", s:[6,0,1,6,6,2], w:1 },
  { week:3,  date:"17 Mar 2026", p1:"Keagan",  p2:"Michael", p3:"Darren",  p4:"Byron",   s:[6,2,6,3,4,6], w:1 },
  { week:3,  date:"17 Mar 2026", p1:"John",    p2:"Brandon", p3:"Connor",  p4:"Graeme",  s:[6,2,3,6,3,6], w:1 },
  { week:4,  date:"23 Mar 2026", p1:"Michael", p2:"Connor",  p3:"Keagan",  p4:"Darren",  s:[6,0,6,4,6,1], w:1 },
  { week:4,  date:"23 Mar 2026", p1:"John",    p2:"Byron",   p3:"Brandon", p4:"Graeme",  s:[6,4,6,4,7,2], w:1 },
  { week:5,  date:"30 Mar 2026", p1:"Michael", p2:"Byron",   p3:"Keagan",  p4:"Connor",  s:[6,3,6,4,7,6], w:1 },
  { week:5,  date:"30 Mar 2026", p1:"Graeme",  p2:"John",    p3:"Brandon", p4:"Nathan",  s:[6,0,6,3,6,2], w:1 },
  { week:6,  date:"06 Apr 2026", p1:"Keagan",  p2:"Byron",   p3:"Graeme",  p4:"Brandon", s:[6,3,4,6,7,6], w:1 },
  { week:7,  date:"13 Apr 2026", p1:"Michael", p2:"Brandon", p3:"Keagan",  p4:"Byron",   s:[7,5,6,3,6,1], w:1 },
  { week:7,  date:"13 Apr 2026", p1:"Graeme",  p2:"Connor",  p3:"Darren",  p4:"John",    s:[6,1,6,0,4,6], w:1 },
  { week:8,  date:"20 Apr 2026", p1:"Keagan",  p2:"Nathan",  p3:"Darren",  p4:"Graeme",  s:[7,5,6,2,6,2], w:1 },
  { week:8,  date:"20 Apr 2026", p1:"Brandon", p2:"Michael", p3:"John",    p4:"Connor",  s:[6,2,6,3,6,3], w:1 },
  { week:9,  date:"06 May 2026", p1:"Keagan",  p2:"Michael", p3:"Nathan",  p4:"Darren",  s:[6,2,4,6,6,1], w:1 },
  { week:9,  date:"06 May 2026", p1:"John",    p2:"Byron",   p3:"Graeme",  p4:"Brandon", s:[6,3,6,7,4,6], w:1 },
  { week:10, date:"12 May 2026", p1:"Byron",   p2:"Michael", p3:"Keagan",  p4:"Darren",  s:[6,3,6,2,6,2], w:1 },
  { week:10, date:"12 May 2026", p1:"John",    p2:"Brandon", p3:"Graeme",  p4:"Connor",  s:[6,4,6,1,5,7], w:1 },
  { week:11, date:"19 May 2026", p1:"Brandon", p2:"Michael", p3:"Keagan",  p4:"Nathan",  s:[6,4,6,3,7,6], w:1 },
  { week:11, date:"19 May 2026", p1:"Shaun",   p2:"Byron",   p3:"Graeme",  p4:"John",    s:[6,0,6,4,6,2], w:1 },
];
const SEASON2 = [
  { week:1, date:"26 May 2026", p1:"Michael",p2:"Byron",  p3:"Keagan", p4:"Nathan",  s:[3,6,6,7,5,7], w:1 },
  { week:1, date:"26 May 2026", p1:"John",   p2:"Brandon",p3:"Connor", p4:"Graeme",  s:[3,6,3,6,7,5], w:1 },
  { week:2, date:"02 Jun 2026", p1:"Graeme", p2:"Michael",p3:"Keagan", p4:"Byron",   s:[6,7,6,2,7,6], w:1 },
  { week:2, date:"02 Jun 2026", p1:"Brandon",p2:"Connor", p3:"Darren", p4:"John",    s:[6,1,6,3,6,2], w:1 },
  { week:3, date:"09 Jun 2026", p1:"Graeme", p2:"Michael",p3:"Keagan", p4:"John",    s:[6,4,6,7,6,4], w:1 },
  { week:3, date:"09 Jun 2026", p1:"Connor", p2:"Byron",  p3:"Darren", p4:"Nathan",  s:[6,3,3,6,6,1], w:1 },
  { week:4, date:"16 Jun 2026", p1:"Keagan", p2:"Connor", p3:"Graeme", p4:"John",    s:[6,0,6,4,6,1], w:1 },
  { week:4, date:"16 Jun 2026", p1:"Byron",  p2:"Nathan", p3:"Michael",p4:"Darren",  s:[6,7,6,1,6,3], w:1 },
  { week:5, date:"23 Jun 2026", p1:"Keagan", p2:"Brandon",p3:"Graeme", p4:"Michael", s:[6,2,6,4,2,6], w:1 },
  { week:5, date:"23 Jun 2026", p1:"Connor", p2:"Nathan", p3:"Byron",  p4:"Darren",  s:[7,5,6,2,6,1], w:1 },
  { week:6, date:"30 Jun 2026", p1:"Graeme", p2:"Nathan", p3:"Keagan", p4:"Brandon", s:[6,2,4,6,6,3], w:1 },
  { week:6, date:"30 Jun 2026", p1:"Connor", p2:"Darren", p3:"Byron",  p4:"John",    s:[4,6,6,4,6,2], w:1 },
  { week:7, date:"07 Jul 2026", p1:"Michael",p2:"Connor", p3:"Darren", p4:"Byron",   s:[6,4,6,3,6,2], w:1 },
  { week:7, date:"07 Jul 2026", p1:"Graeme", p2:"Nathan", p3:"Keagan", p4:"John",    s:[5,7,3,6,6,3], w:1 },
];
const SEASON3_IND = [
  { week:1, date:"14 Jul 2026", p1:"Brandon",p2:"Graeme", p3:"Byron",  p4:"Keagan",  s:[6,4,5,7,4,6], w:1 },
  { week:1, date:"14 Jul 2026", p1:"Darren", p2:"Connor", p3:"John",   p4:"Michael", s:[3,6,6,2,6,3], w:1 },
  { week:2, date:"21 Jul 2026", p1:"John",   p2:"Michael",p3:"Brandon",p4:"Graeme",  s:[6,3,7,5,6,4], w:1 },
  { week:2, date:"21 Jul 2026", p1:"Darren", p2:"Connor", p3:"Byron",  p4:"Keagan",  s:[6,4,7,5,7,5], w:1 },
  { week:3, date:"30 Jul 2026", p1:"Darren", p2:"Connor", p3:"Brandon",p4:"Graeme",  s:[6,3,6,3,6,3], w:1 },
  { week:3, date:"30 Jul 2026", p1:"Byron",  p2:"Keagan", p3:"Nathan", p4:"Brett",   s:[7,6,1,6,7,5], w:1 },
  { week:4, date:"05 Aug 2026", p1:"Byron",  p2:"Keagan", p3:"Darren", p4:"Connor",  s:[6,3,6,4,7,6], w:1 },
  { week:4, date:"05 Aug 2026", p1:"Michael",p2:"John",   p3:"Brandon",p4:"Graeme",  s:[6,7,6,1,6,1], w:1 },
  { week:5, date:"12 Aug 2026", p1:"Darren", p2:"Connor", p3:"Brandon",p4:"Graeme",  s:[7,6,6,4,7,6], w:1 },
  { week:5, date:"12 Aug 2026", p1:"Michael",p2:"John",   p3:"Byron",  p4:"Keagan",  s:[6,1,6,2,7,5], w:1 },
  { week:6, date:"19 Aug 2026", p1:"Byron",  p2:"Keagan", p3:"Brandon",p4:"Graeme",  s:[6,4,7,6,6,3], w:1 },
  { week:6, date:"19 Aug 2026", p1:"Michael",p2:"John",   p3:"Darren", p4:"Connor",  s:[6,3,6,1,6,3], w:1 },
  { week:7, date:"26 Aug 2026", p1:"Byron",  p2:"Keagan", p3:"Darren", p4:"Connor",  s:[7,6,6,4,0,0], w:1 },
  { week:7, date:"26 Aug 2026", p1:"Brandon",p2:"Graeme", p3:"Michael",p4:"John",    s:[7,5,6,4,6,4], w:1 },
  { week:8, date:"02 Sep 2026", p1:"Byron",  p2:"Keagan", p3:"Brandon",p4:"Graeme",  s:[6,4,4,6,6,3], w:1 },
  { week:8, date:"02 Sep 2026", p1:"Michael",p2:"John",   p3:"Darren", p4:"Connor",  s:[7,6,6,7,6,4], w:1 },
];

const ALL_HIST_PLAYERS = ["Brandon","Brett","Byron","Chris","Connor","Darren","Glenn","Graeme","John","Keagan","Michael","Nathan","Shaun"];
const PALETTE = ["#00d4ff","#f472b6","#ffd700","#e879f9","#ff5252","#fb923c","#34d399","#a78bfa","#60a5fa","#00e676","#facc15","#38bdf8","#f87171"];
function pColor(n){const i=ALL_HIST_PLAYERS.indexOf(n);return PALETTE[i>=0?i:PALETTE.length-1];}
function initials(n){return n.slice(0,2).toUpperCase();}

const PLAYER_PHOTOS={};
const PLAYTOMIC_LINKS={
  Brandon:"https://app.playtomic.com/profile/user/3595990",Darren:"https://app.playtomic.com/profile/user/4033294",
  Byron:"https://app.playtomic.com/profile/user/6263685",Keagan:"https://app.playtomic.com/profile/user/5799405",
  Graeme:"https://app.playtomic.com/profile/user/11610652",John:"https://app.playtomic.com/profile/user/7423258",
  Connor:"https://app.playtomic.com/profile/user/9387132",Nathan:"https://app.playtomic.com/profile/user/6810247",
  Michael:"https://app.playtomic.com/profile/user/4203130",
};

function Avatar({name,size=36,ring=false}){
  const c=pColor(name),photo=PLAYER_PHOTOS[name];
  return photo?(
    <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`2px solid ${c}`,boxShadow:ring?`0 0 12px ${c}44`:"none"}}>
      <img src={photo} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
    </div>
  ):(
    <div style={{width:size,height:size,borderRadius:"50%",background:`${c}22`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",color:c,fontWeight:900,fontSize:size*0.3,flexShrink:0,boxShadow:ring?`0 0 12px ${c}44`:"none"}}>
      {initials(name)}
    </div>
  );
}

function ShareBtn({getText}){
  const share=()=>{
    const text=getText();
    try{navigator.clipboard.writeText(text);}catch(e){}
    setTimeout(()=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank"),200);
  };
  function getT(id){return TEAMS.find(t=>t.id===id);}
  function weekGroups(arr){return[...new Set(arr.map(m=>m.week))].sort((a,b)=>b-a);}

  return(    <button onClick={share} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",background:"#25d366",border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Share
    </button>
  );
}

function MatchCard({m,accent}){
  const winners=[m.p1,m.p2],losers=[m.p3,m.p4];
  const ws=[m.s[0],m.s[2],m.s[4]],ls=[m.s[1],m.s[3],m.s[5]];
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{height:3,background:`linear-gradient(90deg,${accent},${accent}44)`}}/>
      {[[winners,ws,ls,true],[losers,ls,ws,false]].map(([team,ts,os,won],ri)=>(
        <div key={ri} style={{display:"flex",alignItems:"center",padding:"13px 16px",background:won?"#00e67608":"transparent",borderBottom:ri===0?`1px solid ${C.border}44`:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
            <div style={{display:"flex",flexShrink:0}}>
              {team.map((n,ni)=><div key={n} style={{marginLeft:ni>0?-10:0,zIndex:ni}}><Avatar name={n} size={34}/></div>)}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:800,fontSize:13,color:won?C.text:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{team[0]} & {team[1]}</div>
              {won&&<div style={{fontSize:9,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1}}>Winner 🏆</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexShrink:0,marginLeft:8}}>
            {ts.map((sc,si)=>sc!==undefined&&sc!==0&&(
              <div key={si} style={{textAlign:"center",minWidth:22}}>
                <div style={{fontSize:22,fontWeight:900,lineHeight:1,color:sc>os[si]?C.text:"#444466"}}>{sc}</div>
                <div style={{fontSize:9,color:"#333355",fontWeight:700}}>S{si+1}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── SEASON 4 POINTS ────────────────────────────────────────────────────────
function calcS4Stats(){
  const stats={};
  S4_PLAYERS.forEach(p=>stats[p]={name:p,played:0,wins:0,losses:0,pts:0,setsW:0,setsL:0});
  S4_SCHEDULE.forEach(week=>{
    week.matches.forEach(m=>{
      if(!m.scores||!m.result)return;
      const [ws,ls]=m.result;
      const t1Won=ws>ls;
      const t1Pts=ws===3&&ls===0?3:ws>ls?2:ls>ws&&ws===1?1:0;
      const t2Pts=ls===3&&ws===0?3:ls>ws?2:ws>ls&&ls===1?1:0;
      [m.p1,m.p2].forEach(p=>{
        if(!stats[p])return;
        stats[p].played++;stats[p].setsW+=ws;stats[p].setsL+=ls;
        if(t1Won){stats[p].wins++;stats[p].pts+=t1Pts;}
        else{stats[p].losses++;stats[p].pts+=t1Pts;}
      });
      [m.p3,m.p4].forEach(p=>{
        if(!stats[p])return;
        stats[p].played++;stats[p].setsW+=ls;stats[p].setsL+=ws;
        if(!t1Won){stats[p].wins++;stats[p].pts+=t2Pts;}
        else{stats[p].losses++;stats[p].pts+=t2Pts;}
      });
    });
  });
  return Object.values(stats).sort((a,b)=>b.pts-a.pts||(b.wins-a.wins)||(b.setsW-b.setsL)-(a.setsW-a.setsL));
}

function calcHistStats(matches){
  const stats={};
  ALL_HIST_PLAYERS.forEach(p=>stats[p]={name:p,w:0,l:0,played:0});
  // Also include any players that appear in matches but aren't in ALL_HIST_PLAYERS
  matches.forEach(m=>[m.p1,m.p2,m.p3,m.p4].forEach(p=>{if(p&&!stats[p])stats[p]={name:p,w:0,l:0,played:0};}));
  matches.forEach(m=>{
    const w1=m.w===1;
    [m.p1,m.p2].forEach(p=>{if(stats[p]){stats[p].played++;if(w1)stats[p].w++;else stats[p].l++;}});
    [m.p3,m.p4].forEach(p=>{if(stats[p]){stats[p].played++;if(!w1)stats[p].w++;else stats[p].l++;}});
  });
  return stats;
}

function calcTeamStandings(schedule){
  const pts={t1:0,t2:2,t3:0,t4:0},sw={t1:0,t2:0,t3:0,t4:0},sl={t1:0,t2:0,t3:0,t4:0},played={t1:0,t2:0,t3:0,t4:0};
  schedule.forEach(r=>r.matches.forEach(m=>{
    if(!m.scores||!m.result||m.t1==="t5"||m.t2==="t5")return;
    played[m.t1]++;played[m.t2]++;
    const[s1,s2]=m.result;
    sw[m.t1]+=s1;sl[m.t1]+=s2;sw[m.t2]+=s2;sl[m.t2]+=s1;
    if(s1>s2){pts[m.t1]+=s1===2&&s2===0?3:2;pts[m.t2]+=s2===1?1:0;}
    else{pts[m.t2]+=s2===2&&s1===0?3:2;pts[m.t1]+=s1===1?1:0;}
  }));
  played["t2"]++;played["t3"]++;
  return TEAMS.filter(t=>t.id!=="t5").map(t=>({...t,pts:pts[t.id]||0,sw:sw[t.id]||0,sl:sl[t.id]||0,played:played[t.id]||0})).sort((a,b)=>b.pts-a.pts||(b.sw-b.sl)-(a.sw-a.sl));
}

const ADMIN_PIN="1234";
const TODAY=new Date("2026-10-21");

export default function App(){
  const [view,setView]=useState("home");
  const [selPlayer,setSelPlayer]=useState(null);
  const [adminMode,setAdminMode]=useState(false);
  const [pinModal,setPinModal]=useState(false);
  const [pin,setPin]=useState("");
  const [pinErr,setPinErr]=useState(false);
  const [s4schedule,setS4Schedule]=useState(S4_SCHEDULE);
  const [fixtures,setFixtures]=useState([]);
  const [toast,setToast]=useState("");
  const [inputScores,setInputScores]=useState({});
  const [newFixture,setNewFixture]=useState({date:"",time:"",venue:"",teams:""});
  const [showAddFixture,setShowAddFixture]=useState(false);

  // Score entry state (Firebase-backed)
  const [scoreEntry,setScoreEntry]=useState({week:"",p1:"",p2:"",p3:"",p4:"",s1:"",s2:"",s3:""});
  const [fbResults,setFbResults]=useState([]);

  // Season 5 setup state
  const [s5Format,setS5Format]=useState({name:"Season 5",type:"teams",weeks:8,courts:2,venue:"Africa Padel KCC",time:"18:30",accent:"#8b5cf6"});
  const [s5Teams,setS5Teams]=useState([
    {id:1,name:"",p1:"",p2:"",color:"#00d4ff"},
    {id:2,name:"",p1:"",p2:"",color:"#f472b6"},
    {id:3,name:"",p1:"",p2:"",color:"#ffd700"},
    {id:4,name:"",p1:"",p2:"",color:"#ff5252"},
  ]);
  const [s5Saved,setS5Saved]=useState(false);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  // Firebase: listen for submitted scores
  useEffect(()=>{
    if(!db)return;
    const r=ref(db,"s4results");
    const unsub=onValue(r,snap=>{
      const data=snap.val();
      if(data){setFbResults(Object.values(data));}
    });
    return()=>unsub();
  },[]);

  // Submit score via Firebase dropdown form
  const submitScoreEntry=()=>{
    const{week,p1,p2,p3,p4,s1,s2,s3}=scoreEntry;
    if(!week||!p1||!p2||!p3||!p4||!s1||!s2){showToast("Fill in all fields");return;}
    if(p1===p2||p1===p3||p1===p4||p2===p3||p2===p4||p3===p4){showToast("Players must all be different");return;}
    const scores=[s1,s2,s3].filter(Boolean);
    let ws=0,ls=0;
    const valid=scores.every(sc=>{const[a,b]=sc.split("-").map(Number);if(isNaN(a)||isNaN(b))return false;if(a>b)ws++;else ls++;return true;});
    if(!valid){showToast("Score format: 6-4");return;}
    const entry={week:Number(week),p1,p2,p3,p4,scores,result:[ws,ls],w:1,submittedAt:Date.now()};
    if(db){
      push(ref(db,"s4results"),entry).then(()=>{showToast("Score saved to Firebase ✓");setScoreEntry({week:"",p1:"",p2:"",p3:"",p4:"",s1:"",s2:"",s3:""});}).catch(e=>showToast("Firebase error: "+e.message));
    } else {
      showToast("Firebase not connected — check config");
    }
  };

  // Save S5 setup to Firebase
  const saveS5Setup=()=>{
    if(!db){showToast("Firebase not connected");return;}
    const setup={...s5Format,teams:s5Teams,savedAt:Date.now()};
    set(ref(db,"season5setup"),setup).then(()=>{setS5Saved(true);showToast("Season 5 setup saved ✓");}).catch(e=>showToast("Error: "+e.message));
  };
  const handlePin=k=>{
    if(k==="⌫"){setPin(p=>p.slice(0,-1));return;}
    if(pin.length>=4)return;
    const next=pin+k;setPin(next);
    if(next.length===4)setTimeout(()=>{if(next===ADMIN_PIN){setAdminMode(true);setPinModal(false);setPin("");setPinErr(false);showToast("Admin on ✓");}else{setPinErr(true);setPin("");setTimeout(()=>setPinErr(false),800);}},120);
  };

  const s4stats=useMemo(()=>calcS4Stats(),[s4schedule]);
  const s3standings=useMemo(()=>calcTeamStandings(S3_SCHEDULE),[]);
  const histStats=useMemo(()=>calcHistStats([...SEASON1,...SEASON2,...SEASON3_IND]),[]);
  const allStats=useMemo(()=>calcHistStats([...SEASON1,...SEASON2,...SEASON3_IND]),[]);

  const activeFixtures=fixtures.filter(f=>new Date(f.date)>=TODAY);
  const completedWeeks=s4schedule.filter(w=>w.matches.some(m=>m.scores));
  const lastWeek=completedWeeks.length>0?completedWeeks[completedWeeks.length-1]:null;

  const saveS4Result=(wi,mi)=>{
    const key=`${wi}-${mi}`,val=inputScores[key]||"";
    const parts=val.split(",").map(s=>s.trim());
    let s1=0,s2=0;
    const valid=parts.length>=2&&parts.every(p=>{const[a,b]=p.split("-").map(Number);if(isNaN(a)||isNaN(b))return false;if(a>b)s1++;else s2++;return true;});
    if(!valid){showToast("Format: 6-4, 3-6, 6-2");return;}
    setS4Schedule(prev=>{const ns=JSON.parse(JSON.stringify(prev));ns[wi].matches[mi].scores=parts;ns[wi].matches[mi].result=[s1,s2];return ns;});
    setInputScores(p=>({...p,[key]:""}));
    showToast("Result saved ✓");
  };

  const getT=id=>TEAMS.find(t=>t.id===id);
  const weekGroups=arr=>[...new Set(arr.map(m=>m.week))].sort((a,b)=>b-a);
  const card={background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"};

  const waS4=()=>{
    let t=`🎾 *DEGENERATES PADEL LEAGUE*\n*⚡ Padelmaxxing — Season 4 Standings*\n\n`;
    s4stats.filter(p=>p.played>0).forEach((p,i)=>t+=`${i+1}. ${p.name} — ${p.pts}pts (${p.wins}W ${p.losses}L)\n`);
    if(lastWeek){
      t+=`\n📅 *Week ${lastWeek.week} Results*\n`;
      lastWeek.matches.forEach(m=>{if(m.scores){t+=`✅ ${m.p1} & ${m.p2} def. ${m.p3} & ${m.p4} (${m.scores.join(", ")})\n`;}});
    }
    return t;
  };

  const NAV=[
    {id:"home",    label:"Home",       icon:"🏠"},
    {id:"s4",      label:"Season 4",   icon:"⚡"},
    {id:"upcoming",label:"Upcoming",   icon:"📆"},
    {id:"dpl",     label:"DPL S3",     icon:"🏆"},
    {id:"s2",      label:"Season 2",   icon:"📅"},
    {id:"s1",      label:"Season 1",   icon:"📜"},
    {id:"players", label:"Players",    icon:"👥"},
    {id:"scores",  label:"Scores",     icon:"📝"},
    {id:"s5setup", label:"S5 Setup",   icon:"🔧"},
  ];

  // Medal colours
  const MEDALS=["🥇","🥈","🥉"];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','system-ui',sans-serif",paddingBottom:80}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1e1e2e;border-radius:4px}input,select,textarea{background:#1a1a2e!important;color:#e2e8f0!important;border:1px solid #2d2d4e!important;border-radius:8px;padding:8px 12px;font-family:inherit;font-size:13px;outline:none;width:100%}input:focus{border-color:#f97316!important}`}</style>

      {toast&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.s4accent,color:"#fff",padding:"10px 24px",borderRadius:12,fontSize:13,fontWeight:800,zIndex:999,whiteSpace:"nowrap"}}>{toast}</div>}

      {pinModal&&(
        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)"}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:24,padding:32,width:280}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
              <span style={{fontWeight:900,fontSize:16}}>Admin PIN</span>
              <button onClick={()=>{setPinModal(false);setPin("");}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:24}}>
              {[0,1,2,3].map(i=><div key={i} style={{width:44,height:44,borderRadius:12,border:`2px solid ${pin.length>i?(pinErr?"#ff5252":C.s4accent):C.border}`,background:pin.length>i?(pinErr?"#ff525222":`${C.s4accent}22`):"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:pinErr?"#ff5252":C.s4accent,fontSize:20,fontWeight:900}}>{pin.length>i?"●":""}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>k===""?<div key={i}/>:<button key={i} onClick={()=>handlePin(String(k))} style={{height:48,borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontWeight:900,fontSize:18,cursor:"pointer",fontFamily:"inherit"}}>{k}</button>)}
            </div>
            {pinErr&&<p style={{textAlign:"center",color:"#ff5252",fontSize:11,fontWeight:800,marginTop:12}}>Wrong PIN</p>}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{background:`${C.card}f0`,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            {LOGO_SQUARE_URL?<img src={LOGO_SQUARE_URL} alt="DPL" style={{width:36,height:36,borderRadius:10,objectFit:"cover"}}/>:<div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#f97316,#ffd700)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎾</div>}
            <span style={{fontWeight:900,fontSize:15,letterSpacing:"-0.03em",color:C.s4accent}}>DPL</span>
          </div>
          <div style={{display:"flex",gap:2,overflowX:"auto",flex:1}}>
            {NAV.map(n=><button key={n.id} onClick={()=>{setView(n.id);setSelPlayer(null);}} style={{padding:"6px 10px",borderRadius:8,border:"none",background:view===n.id?`${n.id==="s4"?C.s4accent:C.accent}22`:"transparent",color:view===n.id?(n.id==="s4"?C.s4accent:C.accent):C.muted,cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>{n.icon} {n.label}</button>)}
          </div>
          <button onClick={()=>adminMode?setAdminMode(false):setPinModal(true)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${adminMode?"#00e67655":C.border}`,background:adminMode?"#00e67611":"transparent",color:adminMode?"#00e676":C.muted,cursor:"pointer",fontWeight:800,fontSize:11,fontFamily:"inherit",flexShrink:0}}>
            {adminMode?"🛡 Admin":"🔒"}
          </button>
        </div>
      </nav>

      <main style={{maxWidth:1000,margin:"0 auto",padding:"20px 16px"}}>

        {/* ═══════════════════════════════ HOME ═══════════════════════════════ */}
        {view==="home"&&(
          <div style={{display:"flex",flexDirection:"column",gap:24}}>

            {/* Hero */}
            <div style={{borderRadius:24,border:`1px solid #f9731633`,overflow:"hidden",position:"relative",background:C.card}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%,#f9731610,transparent 60%),radial-gradient(ellipse at 80% 50%,#ffd70010,transparent 60%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#f97316,#ffd700,#f97316)"}}/>
              <div style={{padding:"40px 28px",display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:240}}>
                  {LOGO_BANNER_URL&&<img src={LOGO_BANNER_URL} alt="DPL" style={{maxWidth:"100%",height:"auto",maxHeight:80,marginBottom:16,display:"block"}}/>}
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f9731611",border:"1px solid #f9731633",borderRadius:99,padding:"5px 14px",marginBottom:12}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:C.s4accent,display:"inline-block",boxShadow:`0 0 8px ${C.s4accent}`}}/>
                    <span style={{fontSize:11,fontWeight:800,color:C.s4accent,textTransform:"uppercase",letterSpacing:"0.1em"}}>⚡ Padelmaxxing — Season 4 Live</span>
                  </div>
                  <h1 style={{fontSize:38,fontWeight:900,lineHeight:1.05,letterSpacing:"-0.04em",marginBottom:10}}>
                    <span style={{background:"linear-gradient(135deg,#f97316,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>DEGENERATES</span>
                    <br/><span style={{color:C.text}}>PADEL LEAGUE</span>
                  </h1>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
                    <button onClick={()=>setView("s4")} style={{padding:"10px 22px",background:C.s4accent,border:"none",borderRadius:12,color:"#fff",fontWeight:900,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Season 4 ⚡</button>
                    <button onClick={()=>setView("dpl")} style={{padding:"10px 22px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>S3 Champions 🏆</button>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,minWidth:180}}>
                  {[{v:"70",l:"Matches",c:C.s4accent},{v:"4",l:"Seasons",c:C.gold},{v:"10",l:"Players",c:C.green},{v:"7",l:"S4 Weeks",c:"#a78bfa"}].map(s=>(
                    <div key={s.l} style={{background:`${s.c}0d`,border:`1px solid ${s.c}22`,borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
                      <div style={{fontSize:28,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                      <div style={{fontSize:10,color:`${s.c}88`,fontWeight:800,textTransform:"uppercase",marginTop:3}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* S4 Leaderboard snapshot */}
            <div style={{...card}}>
              <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,background:`${C.s4accent}0d`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:800,color:C.s4accent,textTransform:"uppercase",letterSpacing:"0.08em"}}>⚡ Padelmaxxing — Current Standings</span>
                <button onClick={()=>setView("s4")} style={{fontSize:11,color:C.s4accent,background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>Full table →</button>
              </div>
              <div style={{padding:"8px 0"}}>
                {s4stats.filter(p=>p.played>0).slice(0,5).map((p,i)=>(
                  <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 18px",borderBottom:`1px solid ${C.border}22`}}>
                    <span style={{fontSize:i<3?18:13,minWidth:24,textAlign:"center",fontWeight:800,color:C.muted}}>{i<3?MEDALS[i]:i+1}</span>
                    <Avatar name={p.name} size={32}/>
                    <span style={{fontWeight:800,fontSize:14,flex:1}}>{p.name}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:11,color:C.green,fontWeight:700}}>{p.wins}W</span>
                      <span style={{fontSize:11,color:C.red,fontWeight:700}}>{p.losses}L</span>
                      <span style={{fontSize:16,fontWeight:900,color:C.s4accent,minWidth:32,textAlign:"right"}}>{p.pts}<span style={{fontSize:9,color:C.muted,fontWeight:700}}>pts</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* S3 Champions callout */}
            <div style={{borderRadius:18,border:`1px solid ${C.gold}44`,padding:20,background:`${C.gold}08`,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <span style={{fontSize:40}}>🏆</span>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:800,color:C.gold,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:2}}>Season 3 Champions</div>
                <div style={{fontSize:20,fontWeight:900,color:C.gold}}>🌀 Circumserve</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>Byron & Keagan · Grand Final Winners</div>
              </div>
              <button onClick={()=>setView("dpl")} style={{padding:"8px 18px",background:C.gold,border:"none",borderRadius:10,color:"#0a0a0f",fontWeight:900,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>View Season 3 →</button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════ SEASON 4 ═══════════════════════════ */}
        {view==="s4"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>

            {/* Banner */}
            <div style={{borderRadius:20,overflow:"hidden",position:"relative",background:C.card,border:`1px solid #f9731644`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,#f97316,#ffd700,#f97316)"}}/>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,#f9731610,transparent 60%)",pointerEvents:"none"}}/>
              <div style={{padding:"28px 24px",position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
                <div>
                  <div style={{fontSize:10,fontWeight:800,color:C.s4accent,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:6}}>Season 4 · Individual Format</div>
                  <h2 style={{fontSize:28,fontWeight:900,letterSpacing:"-0.04em",marginBottom:4}}>
                    <span style={{background:"linear-gradient(135deg,#f97316,#ffd700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ Padelmaxxing</span>
                  </h2>
                  <p style={{fontSize:13,color:C.muted}}>7 weeks pool play · Top 4 advance · Semi-Finals · Grand Final</p>
                  <p style={{fontSize:11,color:C.muted,marginTop:4}}>Scoring: Win 3-0 = 3pts · 2-1 = 2pts · 1-2 = 1pt · 0-3 = 0pts</p>
                </div>
                <ShareBtn getText={waS4}/>
              </div>
            </div>

            {/* League Table */}
            <div style={card}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:`${C.s4accent}0d`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:800,color:C.s4accent,textTransform:"uppercase",letterSpacing:"0.08em"}}>📊 League Table</span>
                <span style={{fontSize:10,color:C.muted}}>After Week {completedWeeks.length}</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${C.border}`,background:C.surface}}>
                      {["Pos","Player","Played","W","L","Set Diff","Points"].map(h=>(
                        <th key={h} style={{padding:"10px 12px",fontSize:9,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:h==="Player"?"left":"center"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s4stats.map((p,i)=>{
                      const sd=(p.setsW||0)-(p.setsL||0);
                      const medal=i<3&&p.played>0?MEDALS[i]:null;
                      return(
                        <tr key={p.name} style={{borderBottom:`1px solid ${C.border}22`,background:i===0&&p.played>0?`${C.s4accent}08`:"transparent"}}
                          onMouseEnter={e=>e.currentTarget.style.background=`${C.s4accent}0d`}
                          onMouseLeave={e=>e.currentTarget.style.background=i===0&&p.played>0?`${C.s4accent}08`:"transparent"}>
                          <td style={{padding:"12px",textAlign:"center"}}>
                            {medal?<span style={{fontSize:18}}>{medal}</span>:<span style={{fontSize:12,fontWeight:800,color:C.muted}}>{i+1}</span>}
                          </td>
                          <td style={{padding:"12px 12px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <Avatar name={p.name} size={30}/>
                              <span style={{fontWeight:800,fontSize:13}}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{textAlign:"center",fontSize:13,color:C.muted,fontWeight:700}}>{p.played}</td>
                          <td style={{textAlign:"center"}}><span style={{fontSize:13,fontWeight:900,color:C.green,background:"#00e67611",borderRadius:8,padding:"2px 10px"}}>{p.wins}</span></td>
                          <td style={{textAlign:"center"}}><span style={{fontSize:13,fontWeight:900,color:C.red,background:"#ff525211",borderRadius:8,padding:"2px 10px"}}>{p.losses}</span></td>
                          <td style={{textAlign:"center",fontSize:13,fontWeight:700,color:sd>0?C.green:sd<0?C.red:C.muted}}>{sd>0?`+${sd}`:sd}</td>
                          <td style={{textAlign:"center"}}><span style={{fontSize:18,fontWeight:900,color:C.s4accent}}>{p.pts}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,fontSize:10,color:C.muted}}>
                Top 4 players advance to Semi-Finals after Week 7
              </div>
            </div>

            {/* Knockout Bracket */}
            <div style={card}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#7c3aed11"}}>
                <span style={{fontSize:11,fontWeight:800,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"0.08em"}}>⚡ Knockout Stage</span>
              </div>
              <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Semi-Finals — TBD (after Week 7)</div>
                {[{l:"Semi A",d:"1st vs 4th Place"},{l:"Semi B",d:"2nd vs 3rd Place"}].map(s=>(
                  <div key={s.l} style={{background:"#7c3aed11",border:"1px solid #7c3aed33",borderRadius:10,padding:12}}>
                    <span style={{fontSize:11,fontWeight:800,color:"#a78bfa"}}>{s.l}</span>
                    <div style={{fontSize:12,color:C.muted,marginTop:2}}>{s.d}</div>
                  </div>
                ))}
                <div style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:4}}>Finals — TBD</div>
                <div style={{background:`${C.gold}11`,border:`1px solid ${C.gold}33`,borderRadius:10,padding:12}}>
                  <div style={{fontSize:11,fontWeight:800,color:C.gold}}>🏆 Grand Final — Winner Semi A vs Winner Semi B</div>
                </div>
                <div style={{background:"#ff525211",border:"1px solid #ff525233",borderRadius:10,padding:12}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#ff5252"}}>💩 Toilet Bowl — Loser Semi A vs Loser Semi B</div>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div style={card}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:800,color:C.s4accent,textTransform:"uppercase",letterSpacing:"0.08em"}}>📅 Full Schedule</span>
                {adminMode&&<span style={{fontSize:10,color:C.green}}>Admin mode — enter results below</span>}
              </div>
              {s4schedule.map((week,wi)=>(
                <div key={wi} style={{borderBottom:`1px solid ${C.border}33`}}>
                  <div style={{padding:"12px 20px",background:`${C.s4accent}08`,display:"flex",gap:10,alignItems:"center",borderBottom:`1px solid ${C.border}22`}}>
                    <span style={{fontSize:12,fontWeight:800,color:C.s4accent}}>Week {week.week}</span>
                    <span style={{fontSize:12,color:C.muted}}>· {week.date}</span>
                    {week.matches.every(m=>m.scores)&&<span style={{fontSize:9,fontWeight:800,color:C.green,background:"#00e67611",borderRadius:99,padding:"2px 8px",marginLeft:4}}>COMPLETE ✓</span>}
                  </div>
                  {week.matches.map((m,mi)=>{
                    const key=`${wi}-${mi}`;
                    const t1Won=m.result&&m.result[0]>m.result[1];
                    return(
                      <div key={mi} style={{padding:"20px",borderBottom:mi<week.matches.length-1?`1px solid ${C.border}22`:"none",background:m.scores?t1Won?"#00e67605":"#ff525205":"transparent"}}>
                        {/* Teams row */}
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:m.scores?12:0,flexWrap:"wrap"}}>
                          {/* Team 1 */}
                          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:160}}>
                            <div style={{display:"flex"}}>{[m.p1,m.p2].map((n,ni)=><div key={n} style={{marginLeft:ni>0?-10:0,zIndex:ni}}><Avatar name={n} size={36}/></div>)}</div>
                            <div>
                              <div style={{fontWeight:900,fontSize:14,color:m.scores&&t1Won?C.text:m.scores?C.muted:C.text}}>{m.p1} & {m.p2}</div>
                              {m.scores&&t1Won&&<div style={{fontSize:9,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1}}>Winner 🏆</div>}
                            </div>
                          </div>
                          {/* VS */}
                          <div style={{width:32,height:32,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:C.muted,flexShrink:0}}>VS</div>
                          {/* Team 2 */}
                          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:160}}>
                            <div style={{display:"flex"}}>{[m.p3,m.p4].map((n,ni)=><div key={n} style={{marginLeft:ni>0?-10:0,zIndex:ni}}><Avatar name={n} size={36}/></div>)}</div>
                            <div>
                              <div style={{fontWeight:900,fontSize:14,color:m.scores&&!t1Won?C.text:m.scores?C.muted:C.text}}>{m.p3} & {m.p4}</div>
                              {m.scores&&!t1Won&&<div style={{fontSize:9,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1}}>Winner 🏆</div>}
                            </div>
                          </div>
                        </div>
                        {/* Scores or input */}
                        {m.scores?(
                          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                            {m.scores.map((sc,si)=>(
                              <span key={si} style={{fontSize:13,fontWeight:800,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"4px 12px",color:C.text}}>{sc}</span>
                            ))}
                          </div>
                        ):adminMode?(
                          <div style={{display:"flex",gap:8,alignItems:"center",marginTop:12}}>
                            <input placeholder="e.g. 6-4, 3-6, 6-2" value={inputScores[key]||""} onChange={e=>setInputScores(p=>({...p,[key]:e.target.value}))} style={{maxWidth:180}}/>
                            <button onClick={()=>saveS4Result(wi,mi)} style={{padding:"8px 18px",background:C.s4accent,border:"none",borderRadius:8,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Save Result</button>
                          </div>
                        ):(
                          <div style={{marginTop:8}}>
                            <span style={{fontSize:11,color:C.s4accent,background:`${C.s4accent}11`,border:`1px solid ${C.s4accent}22`,borderRadius:8,padding:"5px 14px",fontWeight:700}}>Upcoming</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════ UPCOMING ══════════════════════════════ */}
        {view==="upcoming"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{...card,border:`1px solid #f9731633`,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:11,fontWeight:800,color:C.orange,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Live Schedule</div>
                  <h2 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.03em"}}>Upcoming Games</h2>
                  <p style={{fontSize:13,color:C.muted,marginTop:4}}>Season 4 — Padelmaxxing</p>
                </div>
                {adminMode&&<button onClick={()=>setShowAddFixture(!showAddFixture)} style={{padding:"8px 18px",background:C.orange,border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>+ Add Fixture</button>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {s4schedule.filter(w=>w.matches.some(m=>!m.scores)).map(week=>(
                <div key={week.week} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
                  <div style={{padding:"14px 20px",background:`${C.s4accent}0d`,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <span style={{fontWeight:900,fontSize:15,color:C.s4accent}}>⚡ Week {week.week}</span>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      <span style={{fontSize:12,color:C.muted}}>📅 {week.date}</span>
                      <span style={{fontSize:12,color:C.muted}}>🕐 18:30</span>
                      <span style={{fontSize:12,color:C.muted}}>📍 Africa Padel KCC</span>
                    </div>
                  </div>
                  {week.matches.filter(m=>!m.scores).map((m,mi)=>(
                    <div key={mi} style={{padding:"20px",borderBottom:mi===0?`1px solid ${C.border}22`:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:160}}>
                          <div style={{display:"flex"}}>{[m.p1,m.p2].map((n,ni)=><div key={n} style={{marginLeft:ni>0?-10:0,zIndex:ni}}><Avatar name={n} size={38}/></div>)}</div>
                          <div>
                            <div style={{fontWeight:900,fontSize:14}}>{m.p1} & {m.p2}</div>
                            <div style={{fontSize:10,color:C.muted,marginTop:2}}>Court {mi+1}</div>
                          </div>
                        </div>
                        <div style={{width:36,height:36,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:C.muted,flexShrink:0}}>VS</div>
                        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:160}}>
                          <div style={{display:"flex"}}>{[m.p3,m.p4].map((n,ni)=><div key={n} style={{marginLeft:ni>0?-10:0,zIndex:ni}}><Avatar name={n} size={38}/></div>)}</div>
                          <div>
                            <div style={{fontWeight:900,fontSize:14}}>{m.p3} & {m.p4}</div>
                            <div style={{fontSize:10,color:C.muted,marginTop:2}}>Court {mi+1}</div>
                          </div>
                        </div>
                        <span style={{fontSize:11,color:C.s4accent,background:`${C.s4accent}11`,border:`1px solid ${C.s4accent}33`,borderRadius:8,padding:"5px 14px",fontWeight:800,flexShrink:0}}>Upcoming</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════ DPL S3 ═══════════════════════════════ */}
        {view==="dpl"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {/* Champions */}
            <div style={{borderRadius:20,overflow:"hidden",position:"relative",border:`2px solid ${C.gold}`,background:C.card}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,#ffd700,#fff,#ffd700)`}}/>
              <div style={{padding:"28px 24px",textAlign:"center",position:"relative",zIndex:1}}>
                <div style={{fontSize:44,marginBottom:8}}>🏆</div>
                <div style={{fontSize:10,fontWeight:800,color:C.gold,textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:4}}>Season 3 Champions</div>
                <h3 style={{fontSize:28,fontWeight:900,color:C.gold,marginBottom:4}}>🌀 Circumserve</h3>
                <p style={{fontSize:13,color:C.muted}}>Byron & Keagan · Grand Final def. Overhead Casualties 6-4, 4-6, 6-3</p>
              </div>
            </div>
            {/* S3 schedule */}
            <div style={card}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:11,fontWeight:800,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em"}}>📅 Season 3 Full Results</span>
              </div>
              {S3_SCHEDULE.map((round,ri)=>(
                <div key={ri} style={{borderBottom:`1px solid ${C.border}22`}}>
                  <div style={{padding:"9px 16px",background:`${C.gold}08`,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:800,color:C.gold}}>{typeof round.round==="number"?`Round ${round.round}`:round.round==="SF"?"Semi-Finals":"Grand Final / Toilet Bowl"}</span>
                    <span style={{fontSize:11,color:C.muted}}>· {round.date}</span>
                  </div>
                  {round.matches.map((m,mi)=>{
                    const t1=getT(m.t1),t2=getT(m.t2);
                    if(!t1||!t2)return null;
                    return(
                      <div key={mi} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:mi<round.matches.length-1?`1px solid ${C.border}11`:"none",flexWrap:"wrap"}}>
                        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,minWidth:180}}>
                          <span style={{fontSize:14}}>{t1.emoji}</span>
                          <span style={{fontWeight:800,fontSize:12,color:t1.color}}>{t1.name}</span>
                          <span style={{color:C.muted,fontSize:10,padding:"0 4px"}}>vs</span>
                          <span style={{fontSize:14}}>{t2.emoji}</span>
                          <span style={{fontWeight:800,fontSize:12,color:t2.color}}>{t2.name}</span>
                        </div>
                        {m.scores&&(
                          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                            {m.scores.map((sc,si)=><span key={si} style={{fontSize:12,fontWeight:800,background:C.surface,borderRadius:6,padding:"2px 8px"}}>{sc}</span>)}
                            <span style={{fontSize:11,fontWeight:800,color:m.result[0]>m.result[1]?t1.color:t2.color,background:C.surface,borderRadius:8,padding:"3px 10px"}}>
                              {m.result[0]>m.result[1]?`${t1.name} wins`:`${t2.name} wins`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════ SEASON 2 ══════════════════════════════ */}
        {view==="s2"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{...card,padding:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Archive</div>
                <h2 style={{fontSize:24,fontWeight:900,marginBottom:4}}>Season 2</h2>
                <p style={{fontSize:13,color:C.muted}}>Individual format · 7 weeks · 14 matches</p>
              </div>
            </div>
            {weekGroups(SEASON2).map(week=>(
              <div key={week}>
                <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0 10px"}}>
                  <div style={{flex:1,height:1,background:C.border}}/>
                  <span style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase"}}>Week {week} · {SEASON2.find(m=>m.week===week)?.date}</span>
                  <div style={{flex:1,height:1,background:C.border}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                  {SEASON2.filter(m=>m.week===week).map((m,i)=><MatchCard key={i} m={m} accent={C.accent}/>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════ SEASON 1 ══════════════════════════════ */}
        {view==="s1"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{...card,padding:20}}>
              <div style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Archive</div>
              <h2 style={{fontSize:24,fontWeight:900,marginBottom:4}}>Season 1</h2>
              <p style={{fontSize:13,color:C.muted}}>Individual format · 11 weeks · 21 matches</p>
            </div>
            {weekGroups(SEASON1).map(week=>(
              <div key={week}>
                <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0 10px"}}>
                  <div style={{flex:1,height:1,background:C.border}}/>
                  <span style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase"}}>Week {week} · {SEASON1.find(m=>m.week===week)?.date}</span>
                  <div style={{flex:1,height:1,background:C.border}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                  {SEASON1.filter(m=>m.week===week).map((m,i)=><MatchCard key={i} m={m} accent={C.gold}/>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════ PLAYERS ═══════════════════════════════ */}
        {view==="players"&&!selPlayer&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{...card,padding:20}}>
              <h2 style={{fontSize:24,fontWeight:900,marginBottom:4}}>Player Profiles</h2>
              <p style={{fontSize:13,color:C.muted}}>All-time stats + Season 4 standings</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
              {ALL_HIST_PLAYERS.map(p=>{
                const hs=allStats[p]||{w:0,l:0,played:0};
                const s4=s4stats.find(x=>x.name===p)||{pts:0,wins:0,losses:0,played:0};
                const col=pColor(p);
                return(
                  <div key={p} onClick={()=>setSelPlayer(p)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=col}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div style={{height:70,background:`${col}0d`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Avatar name={p} size={52} ring/>
                    </div>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{fontWeight:900,fontSize:13,marginBottom:8}}>{p}</div>
                      <div style={{display:"flex",gap:5,marginBottom:6}}>
                        <div style={{flex:1,background:"#00e67611",borderRadius:7,padding:"5px 3px",textAlign:"center"}}>
                          <div style={{fontSize:14,fontWeight:900,color:C.green}}>{hs.w}</div>
                          <div style={{fontSize:7,color:"#00e67688",fontWeight:800,textTransform:"uppercase"}}>All-W</div>
                        </div>
                        <div style={{flex:1,background:"#ff525211",borderRadius:7,padding:"5px 3px",textAlign:"center"}}>
                          <div style={{fontSize:14,fontWeight:900,color:C.red}}>{hs.l}</div>
                          <div style={{fontSize:7,color:"#ff525288",fontWeight:800,textTransform:"uppercase"}}>All-L</div>
                        </div>
                        <div style={{flex:1,background:`${C.s4accent}11`,borderRadius:7,padding:"5px 3px",textAlign:"center"}}>
                          <div style={{fontSize:14,fontWeight:900,color:C.s4accent}}>{s4.pts}</div>
                          <div style={{fontSize:7,color:`${C.s4accent}88`,fontWeight:800,textTransform:"uppercase"}}>S4 Pts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view==="players"&&selPlayer&&(()=>{
          const p=selPlayer,col=pColor(p);
          const hs=allStats[p]||{w:0,l:0,played:0};
          const s4p=s4stats.find(x=>x.name===p)||{pts:0,wins:0,losses:0,played:0};
          const allM=[...SEASON1,...SEASON2,...SEASON3_IND].filter(m=>[m.p1,m.p2,m.p3,m.p4].includes(p));
          return(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <button onClick={()=>setSelPlayer(null)} style={{alignSelf:"flex-start",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>← Players</button>
              <div style={{background:C.card,border:`1px solid ${col}44`,borderRadius:20,padding:24,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:`radial-gradient(circle,${col}0d,transparent 70%)`,pointerEvents:"none"}}/>
                <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20,flexWrap:"wrap"}}>
                  <Avatar name={p} size={72} ring/>
                  <div>
                    <h2 style={{fontSize:28,fontWeight:900,color:col}}>{p}</h2>
                    <div style={{fontSize:12,color:C.muted,marginTop:4}}>⚡ Season 4: {s4p.pts} pts · {s4p.wins}W {s4p.losses}L</div>
                    <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                      {PLAYTOMIC_LINKS[p]&&<a href={PLAYTOMIC_LINKS[p]} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.accent,background:`${C.accent}11`,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"5px 12px",textDecoration:"none",fontWeight:700}}>🎾 Playtomic</a>}
                    </div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {[{l:"All-time W",v:hs.w,c:C.gold},{l:"All-time L",v:hs.l,c:C.red},{l:"S4 Pts",v:s4p.pts,c:C.s4accent},{l:"Win Rate",v:hs.played>0?`${Math.round(hs.w/hs.played*100)}%`:"—",c:C.green}].map(st=>(
                    <div key={st.l} style={{background:`${st.c}0d`,border:`1px solid ${st.c}22`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:900,color:st.c}}>{st.v}</div>
                      <div style={{fontSize:8,color:`${st.c}88`,fontWeight:800,textTransform:"uppercase",marginTop:2}}>{st.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Historical Match History</span>
                </div>
                {allM.slice(-8).reverse().map((m,i)=>{
                  const onWin=[m.p1,m.p2].includes(p)?m.w===1:m.w===2;
                  const partner=[m.p1,m.p2].includes(p)?[m.p1,m.p2].find(x=>x!==p):[m.p3,m.p4].find(x=>x!==p);
                  const opp=[m.p1,m.p2].includes(p)?`${m.p3} & ${m.p4}`:`${m.p1} & ${m.p2}`;
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${C.border}22`,background:onWin?"#00e67606":"transparent"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:14}}>{onWin?"✅":"❌"}</span>
                        <div>
                          <div style={{fontSize:12,fontWeight:700}}>w/ {partner} vs {opp}</div>
                          <div style={{fontSize:10,color:C.muted}}>Wk {m.week} · {m.date}</div>
                        </div>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,color:onWin?C.green:C.red,background:onWin?"#00e67611":"#ff525211",borderRadius:8,padding:"3px 10px"}}>{onWin?"WIN":"LOSS"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })(        )}

        {/* ════════════════════════════ SCORE ENTRY ═══════════════════════════ */}
        {view==="scores"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{borderRadius:20,border:`1px solid #f9731633`,padding:24,background:C.card}}>
              <div style={{fontSize:11,fontWeight:800,color:C.s4accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Admin Tool</div>
              <h2 style={{fontSize:24,fontWeight:900,marginBottom:4}}>Score Entry</h2>
              <p style={{fontSize:13,color:C.muted}}>Enter match results using dropdowns — saves directly to Firebase</p>
              {!adminMode&&<div style={{marginTop:12,padding:"10px 16px",background:"#ff525211",border:"1px solid #ff525233",borderRadius:10,fontSize:12,color:"#ff8888"}}>🔒 Enable admin mode to submit scores</div>}
            </div>

            {adminMode&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{fontSize:12,fontWeight:800,color:C.s4accent,marginBottom:16,textTransform:"uppercase",letterSpacing:"0.08em"}}>📝 Submit New Result — Season 4</div>

                {/* Week selector */}
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Week</label>
                  <select value={scoreEntry.week} onChange={e=>setScoreEntry(p=>({...p,week:e.target.value}))} style={{background:"#1a1a2e",color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                    <option value="">— Select Week —</option>
                    {S4_SCHEDULE.map(w=><option key={w.week} value={w.week}>Week {w.week} · {w.date}</option>)}
                  </select>
                </div>

                {/* Team 1 */}
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>🏆 Winning Team</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {["p1","p2"].map((pk,pi)=>(
                      <div key={pk}>
                        <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:4}}>Player {pi+1}</label>
                        <select value={scoreEntry[pk]} onChange={e=>setScoreEntry(p=>({...p,[pk]:e.target.value}))} style={{background:"#1a1a2e",color:C.text,border:`1px solid #00e67633`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                          <option value="">— Select —</option>
                          {S4_PLAYERS.map(p=><option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:800,color:C.red,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>❌ Losing Team</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {["p3","p4"].map((pk,pi)=>(
                      <div key={pk}>
                        <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:4}}>Player {pi+1}</label>
                        <select value={scoreEntry[pk]} onChange={e=>setScoreEntry(p=>({...p,[pk]:e.target.value}))} style={{background:"#1a1a2e",color:C.text,border:`1px solid #ff525233`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                          <option value="">— Select —</option>
                          {S4_PLAYERS.map(p=><option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Set scores */}
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Set Scores (winner first e.g. 6-4)</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    {["s1","s2","s3"].map((sk,si)=>(
                      <div key={sk}>
                        <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:4}}>Set {si+1}{si===2?" (if needed)":""}</label>
                        <input
                          placeholder={si===2?"optional":"e.g. 6-4"}
                          value={scoreEntry[sk]}
                          onChange={e=>setScoreEntry(p=>({...p,[sk]:e.target.value}))}
                          style={{background:"#1a1a2e",color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {scoreEntry.p1&&scoreEntry.p2&&scoreEntry.p3&&scoreEntry.p4&&scoreEntry.s1&&scoreEntry.s2&&(
                  <div style={{background:"#00e67608",border:"1px solid #00e67622",borderRadius:10,padding:12,marginBottom:16,fontSize:12}}>
                    <span style={{fontWeight:800,color:C.green}}>Preview: </span>
                    <span style={{color:C.text}}>{scoreEntry.p1} & {scoreEntry.p2}</span>
                    <span style={{color:C.muted}}> def. </span>
                    <span style={{color:C.text}}>{scoreEntry.p3} & {scoreEntry.p4}</span>
                    <span style={{color:C.muted}}> ({[scoreEntry.s1,scoreEntry.s2,scoreEntry.s3].filter(Boolean).join(", ")})</span>
                    {scoreEntry.week&&<span style={{color:C.muted}}> — Week {scoreEntry.week}</span>}
                  </div>
                )}

                <button onClick={submitScoreEntry} style={{width:"100%",padding:"14px",background:C.s4accent,border:"none",borderRadius:12,color:"#fff",fontWeight:900,fontSize:14,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.02em"}}>
                  Submit Result to Firebase ⚡
                </button>
              </div>
            )}

            {/* Firebase results log */}
            {fbResults.length>0&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#00e67608"}}>
                  <span style={{fontSize:11,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em"}}>✅ Firebase Results Log ({fbResults.length})</span>
                </div>
                {[...fbResults].sort((a,b)=>b.submittedAt-a.submittedAt).map((r,i)=>(
                  <div key={i} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}22`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <div>
                      <span style={{fontWeight:800,fontSize:13}}>{r.p1} & {r.p2}</span>
                      <span style={{color:C.muted,fontSize:12}}> def. {r.p3} & {r.p4}</span>
                      <div style={{fontSize:11,color:C.muted,marginTop:2}}>Week {r.week} · {r.scores?.join(", ")}</div>
                    </div>
                    <span style={{fontSize:10,background:"#00e67611",color:C.green,borderRadius:8,padding:"3px 10px",fontWeight:800}}>Saved ✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════ S5 SETUP ══════════════════════════════ */}
        {view==="s5setup"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{borderRadius:20,border:`1px solid #8b5cf633`,padding:24,background:C.card}}>
              <div style={{fontSize:11,fontWeight:800,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Season Builder</div>
              <h2 style={{fontSize:24,fontWeight:900,marginBottom:4}}>Season 5 Setup</h2>
              <p style={{fontSize:13,color:C.muted}}>Configure the next season — teams, format, schedule. Saves to Firebase.</p>
            </div>

            {/* Season settings */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
              <div style={{fontSize:12,fontWeight:800,color:"#a78bfa",marginBottom:16,textTransform:"uppercase",letterSpacing:"0.08em"}}>⚙️ Season Settings</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  {label:"Season Name",key:"name",placeholder:"e.g. Season 5"},
                  {label:"Venue",key:"venue",placeholder:"e.g. Africa Padel KCC"},
                  {label:"Kickoff Time",key:"time",placeholder:"e.g. 18:30"},
                  {label:"Accent Colour",key:"accent",placeholder:"#8b5cf6"},
                ].map(f=>(
                  <div key={f.key}>
                    <label style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:5}}>{f.label}</label>
                    <input value={s5Format[f.key]} onChange={e=>setS5Format(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                      style={{background:"#1a1a2e",color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}/>
                  </div>
                ))}
                <div>
                  <label style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:5}}>Format</label>
                  <select value={s5Format.type} onChange={e=>setS5Format(p=>({...p,type:e.target.value}))} style={{background:"#1a1a2e",color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                    <option value="teams">Teams (fixed pairs)</option>
                    <option value="individual">Individual (random pairs)</option>
                    <option value="groups">Groups + Knockout</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:5}}>Number of Weeks</label>
                  <select value={s5Format.weeks} onChange={e=>setS5Format(p=>({...p,weeks:Number(e.target.value)}))} style={{background:"#1a1a2e",color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                    {[4,5,6,7,8,9,10,12].map(n=><option key={n} value={n}>{n} weeks</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:5}}>Courts per Week</label>
                  <select value={s5Format.courts} onChange={e=>setS5Format(p=>({...p,courts:Number(e.target.value)}))} style={{background:"#1a1a2e",color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                    {[1,2,3,4].map(n=><option key={n} value={n}>{n} court{n>1?"s":""}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Team builder */}
            {s5Format.type==="teams"&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"0.08em"}}>👥 Team Pairings</div>
                  <button onClick={()=>setS5Teams(p=>[...p,{id:Date.now(),name:"",p1:"",p2:"",color:"#" + Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0")}])}
                    style={{padding:"6px 14px",background:"#8b5cf622",border:"1px solid #8b5cf633",borderRadius:8,color:"#a78bfa",fontWeight:800,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                    + Add Team
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {s5Teams.map((team,ti)=>(
                    <div key={team.id} style={{background:C.surface,border:`1px solid ${team.color}33`,borderRadius:12,padding:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <input type="color" value={team.color} onChange={e=>setS5Teams(p=>p.map((t,i)=>i===ti?{...t,color:e.target.value}:t))} style={{width:28,height:28,border:"none",background:"none",cursor:"pointer",padding:0}}/>
                          <input value={team.name} onChange={e=>setS5Teams(p=>p.map((t,i)=>i===ti?{...t,name:e.target.value}:t))} placeholder={`Team ${ti+1} name`}
                            style={{background:"transparent",color:team.color,border:"none",borderBottom:`1px solid ${team.color}44`,borderRadius:0,padding:"4px 0",fontSize:14,fontWeight:900,width:160,fontFamily:"inherit",outline:"none"}}/>
                        </div>
                        {s5Teams.length>2&&<button onClick={()=>setS5Teams(p=>p.filter((_,i)=>i!==ti))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {["p1","p2"].map((pk,pi)=>(
                          <div key={pk}>
                            <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:4}}>Player {pi+1}</label>
                            <select value={team[pk]} onChange={e=>setS5Teams(p=>p.map((t,i)=>i===ti?{...t,[pk]:e.target.value}:t))}
                              style={{background:"#1a1a2e",color:C.text,border:`1px solid ${team.color}33`,borderRadius:8,padding:"8px 12px",fontSize:13,width:"100%",fontFamily:"inherit",outline:"none"}}>
                              <option value="">— Select Player —</option>
                              {ALL_HIST_PLAYERS.filter(p=>p!=="Brett"&&p!=="Shaun").map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            <div style={{background:C.card,border:`1px solid #8b5cf633`,borderRadius:16,padding:20}}>
              <div style={{fontSize:12,fontWeight:800,color:"#a78bfa",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em"}}>👁 Preview</div>
              <div style={{background:C.surface,borderRadius:12,padding:16}}>
                <div style={{fontSize:18,fontWeight:900,color:"#a78bfa",marginBottom:4}}>{s5Format.name||"Season 5"}</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{s5Format.type==="teams"?"Teams Format":s5Format.type==="individual"?"Individual Format":"Groups + Knockout"} · {s5Format.weeks} weeks · {s5Format.courts} court{s5Format.courts>1?"s":""}/week</div>
                <div style={{fontSize:12,color:C.muted}}>📍 {s5Format.venue||"TBD"} · 🕐 {s5Format.time||"TBD"}</div>
                {s5Format.type==="teams"&&s5Teams.filter(t=>t.name&&t.p1&&t.p2).length>0&&(
                  <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
                    {s5Teams.filter(t=>t.name||t.p1).map((t,i)=>(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",background:`${t.color}0d`,borderRadius:8,border:`1px solid ${t.color}22`}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:t.color,flexShrink:0}}/>
                        <span style={{fontWeight:800,fontSize:12,color:t.color}}>{t.name||`Team ${i+1}`}</span>
                        {t.p1&&t.p2&&<span style={{fontSize:11,color:C.muted}}>· {t.p1} & {t.p2}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save */}
            <button onClick={saveS5Setup} style={{padding:"16px",background:"linear-gradient(135deg,#8b5cf6,#a78bfa)",border:"none",borderRadius:14,color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.02em"}}>
              {s5Saved?"✓ Saved to Firebase":"💾 Save Season 5 Setup to Firebase"}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
