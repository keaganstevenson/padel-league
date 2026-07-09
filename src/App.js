import { useState, useMemo } from "react";

// Replace these with your direct image links (e.g. https://i.imgur.com/xxxxx.png)
// Imgur album/gallery links (imgur.com/a/...) won't work directly in <img> tags —
// open the image on imgur.com, right-click it, and "Copy image address" to get
// a direct link that starts with https://i.imgur.com/
const LOGO_SQUARE_URL = "https://i.imgur.com/p6qJIP1.jpeg"; // square logo — shown in the nav bar
const LOGO_BANNER_URL = "https://i.imgur.com/dUkcrm5.jpeg"; // banner logo — shown in the hero section on Home

const C = {
  bg:"#0a0a0f", card:"#12121a", border:"#1e1e2e", accent:"#00d4ff",
  gold:"#ffd700", silver:"#c0c0c0", bronze:"#cd7f32",
  green:"#00e676", red:"#ff5252", muted:"#6b7280", text:"#e2e8f0",
  surface:"#16162a", purple:"#7c3aed", orange:"#f97316",
};

const TEAMS = [
  { id:"t1", name:"Overhead Casualties", short:"Overhead Casualties", color:"#00d4ff", p1:"Brandon", p2:"Graeme", emoji:"💥" },
  { id:"t2", name:"Circumserve",         short:"Circumserve",         color:"#ffd700", p1:"Byron",   p2:"Keagan", emoji:"🌀" },
  { id:"t3", name:"One Nice Guy",        short:"One Nice Guy",        color:"#00e676", p1:"John",    p2:"Michael",emoji:"😇" },
  { id:"t4", name:"EFF",                 short:"EFF",                 color:"#ff5252", p1:"Darren",  p2:"Connor", emoji:"🔥" },
];

const SCHEDULE = [
  { round:1, date:"Tue, 14 Jul 2026", matches:[
    { t1:"t1", t2:"t2", scores:null },
    { t1:"t3", t2:"t4", scores:null },
  ]},
  { round:2, date:"Tue, 21 Jul 2026", matches:[
    { t1:"t1", t2:"t3", scores:null },
    { t1:"t2", t2:"t4", scores:null },
  ]},
  { round:3, date:"Tue, 28 Jul 2026", matches:[
    { t1:"t1", t2:"t4", scores:null },
    { t1:"t2", t2:"t3", scores:null },
  ]},
];

const UPCOMING_FIXTURES = [
  { id:"f1", date:"2026-07-14", time:"18:30", venue:"Africa Padel KCC", teams:"Overhead Casualties vs Circumserve" },
  { id:"f2", date:"2026-07-14", time:"19:30", venue:"Africa Padel KCC", teams:"One Nice Guy vs EFF" },
  { id:"f3", date:"2026-07-21", time:"18:30", venue:"Africa Padel KCC", teams:"Overhead Casualties vs One Nice Guy" },
  { id:"f4", date:"2026-07-21", time:"19:30", venue:"Africa Padel KCC", teams:"Circumserve vs EFF" },
  { id:"f5", date:"2026-07-28", time:"18:30", venue:"Africa Padel KCC", teams:"Overhead Casualties vs EFF" },
  { id:"f6", date:"2026-07-28", time:"19:30", venue:"Africa Padel KCC", teams:"Circumserve vs One Nice Guy" },
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
  { week:1,  date:"26 May 2026", p1:"Michael", p2:"Byron",   p3:"Keagan",  p4:"Nathan",  s:[3,6,6,7,5,7], w:1 },
  { week:1,  date:"26 May 2026", p1:"John",    p2:"Brandon", p3:"Connor",  p4:"Graeme",  s:[3,6,3,6,7,5], w:1 },
  { week:2,  date:"02 Jun 2026", p1:"Graeme",  p2:"Michael", p3:"Keagan",  p4:"Byron",   s:[6,7,6,2,7,6], w:1 },
  { week:2,  date:"02 Jun 2026", p1:"Brandon", p2:"Connor",  p3:"Darren",  p4:"John",    s:[6,1,6,3,6,2], w:1 },
  { week:3,  date:"09 Jun 2026", p1:"Graeme",  p2:"Michael", p3:"Keagan",  p4:"John",    s:[6,4,6,7,6,4], w:1 },
  { week:3,  date:"09 Jun 2026", p1:"Connor",  p2:"Byron",   p3:"Darren",  p4:"Nathan",  s:[6,3,3,6,6,1], w:1 },
  { week:4,  date:"16 Jun 2026", p1:"Keagan",  p2:"Connor",  p3:"Graeme",  p4:"John",    s:[6,0,6,4,6,1], w:1 },
  { week:4,  date:"16 Jun 2026", p1:"Byron",   p2:"Nathan",  p3:"Michael", p4:"Darren",  s:[6,7,6,1,6,3], w:1 },
  { week:5,  date:"23 Jun 2026", p1:"Keagan",  p2:"Brandon", p3:"Graeme",  p4:"Michael", s:[6,2,6,4,2,6], w:1 },
  { week:5,  date:"23 Jun 2026", p1:"Connor",  p2:"Nathan",  p3:"Byron",   p4:"Darren",  s:[7,5,6,2,6,1], w:1 },
  { week:6,  date:"30 Jun 2026", p1:"Graeme",  p2:"Nathan",  p3:"Keagan",  p4:"Brandon", s:[6,2,4,6,6,3], w:1 },
  { week:6,  date:"30 Jun 2026", p1:"Connor",  p2:"Darren",  p3:"Byron",   p4:"John",    s:[4,6,6,4,6,2], w:1 },
  { week:7,  date:"07 Jul 2026", p1:"Michael", p2:"Connor",  p3:"Darren",  p4:"Byron",   s:[6,4,6,3,6,2], w:1 },
  { week:7,  date:"07 Jul 2026", p1:"Graeme",  p2:"Nathan",  p3:"Keagan",  p4:"John",    s:[5,7,3,6,6,3], w:1 },
];

const ALL_PLAYERS = ["Brandon","Byron","Connor","Darren","Graeme","John","Keagan","Michael","Nathan"];
const PLAYER_PHOTOS = {
  Brandon: null, Byron: null, Connor: null, Darren: null,
  Graeme: null, John: null, Keagan: null, Michael: null, Nathan: null,
};
const PLAYTOMIC_LINKS = {
  Brandon: "https://app.playtomic.com/profile/user/3595990?utm_source=app_ios&utm_campaign=share",
  Darren: "https://app.playtomic.com/profile/user/4033294?utm_campaign=share&utm_source=app_ios",
  Byron: "https://app.playtomic.com/profile/user/6263685?utm_campaign=share&utm_source=app_ios",
  Keagan: "https://app.playtomic.com/profile/user/5799405?utm_source=app_ios&utm_campaign=share",
  Graeme: "https://app.playtomic.com/profile/user/11610652?utm_source=app_ios&utm_campaign=share",
  John: "https://app.playtomic.com/profile/user/7423258?utm_source=app_ios&utm_campaign=share",
  Connor: "https://app.playtomic.com/profile/user/9387132?utm_source=app_ios&utm_campaign=share",
  Nathan: "https://app.playtomic.com/profile/user/6810247?utm_source=app_ios&utm_campaign=share",
  Michael: "https://app.playtomic.com/profile/user/4203130?utm_source=app_ios&utm_campaign=share",
};
const PALETTE = ["#00d4ff","#ffd700","#00e676","#ff5252","#a78bfa","#fb923c","#34d399","#f472b6","#60a5fa"];
function pColor(n) { const i=ALL_PLAYERS.indexOf(n); return PALETTE[i>=0?i:0]; }
function initials(n) { return n.slice(0,2).toUpperCase(); }

function Avatar({ name, size=36, ring=false }) {
  const c = pColor(name);
  const photo = PLAYER_PHOTOS[name];
  return photo ? (
    <div style={{ width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`2px solid ${c}`,boxShadow:ring?`0 0 12px ${c}44`:"none" }}>
      <img src={photo} alt={name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
    </div>
  ) : (
    <div style={{ width:size,height:size,borderRadius:"50%",background:`${c}22`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",color:c,fontWeight:900,fontSize:size*0.3,flexShrink:0,boxShadow:ring?`0 0 12px ${c}44`:"none" }}>
      {initials(name)}
    </div>
  );
}

const ADMIN_PIN = "1234";

function calcStats(matches) {
  const stats = {};
  ALL_PLAYERS.forEach(p => stats[p]={name:p,w:0,l:0,played:0});
  matches.forEach(m => {
    const w1=m.w===1;
    [m.p1,m.p2].forEach(p=>{ if(stats[p]){stats[p].played++;if(w1)stats[p].w++;else stats[p].l++;}});
    [m.p3,m.p4].forEach(p=>{ if(stats[p]){stats[p].played++;if(!w1)stats[p].w++;else stats[p].l++;}});
  });
  return Object.values(stats).filter(p=>p.played>0).sort((a,b)=>b.w-a.w||a.l-b.l);
}

function calcTeamStandings(schedule) {
  const pts={t1:0,t2:0,t3:0,t4:0},sw={t1:0,t2:0,t3:0,t4:0},sl={t1:0,t2:0,t3:0,t4:0},played={t1:0,t2:0,t3:0,t4:0};
  schedule.forEach(r=>r.matches.forEach(m=>{
    if(!m.scores||!m.result)return;
    played[m.t1]++;played[m.t2]++;
    const[s1,s2]=m.result;
    sw[m.t1]+=s1;sl[m.t1]+=s2;sw[m.t2]+=s2;sl[m.t2]+=s1;
    if(s1>s2){pts[m.t1]+=s1===2&&s2===0?3:2;pts[m.t2]+=s2===1?1:0;}
    else{pts[m.t2]+=s2===2&&s1===0?3:2;pts[m.t1]+=s1===1?1:0;}
  }));
  return TEAMS.map(t=>({...t,pts:pts[t.id],sw:sw[t.id],sl:sl[t.id],played:played[t.id]})).sort((a,b)=>b.pts-a.pts||(b.sw-b.sl)-(a.sw-a.sl));
}

function MatchCard({ m, accent }) {
  const winners=[m.p1,m.p2], losers=[m.p3,m.p4];
  const ws=[m.s[0],m.s[2],m.s[4]], ls=[m.s[1],m.s[3],m.s[5]];
  return (
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden" }}>
      <div style={{ height:3,background:`linear-gradient(90deg,${accent||C.accent},${accent||C.accent}44)` }}/>
      {[[winners,ws,ls,true],[losers,ls,ws,false]].map(([team,ts,os,won],ri)=>(
        <div key={ri} style={{ display:"flex",alignItems:"center",padding:"13px 16px",background:won?"#00e67608":"transparent",borderBottom:ri===0?`1px solid ${C.border}44`:"none" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0 }}>
            <div style={{ display:"flex",flexShrink:0 }}>
              {team.map((n,ni)=><div key={n} style={{ marginLeft:ni>0?-10:0,zIndex:ni }}><Avatar name={n} size={34}/></div>)}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:800,fontSize:13,color:won?C.text:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{team[0]} & {team[1]}</div>
              {won&&<div style={{ fontSize:9,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1 }}>Winner 🏆</div>}
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexShrink:0,marginLeft:8 }}>
            {ts.map((sc,si)=>sc!==undefined&&(
              <div key={si} style={{ textAlign:"center",minWidth:22 }}>
                <div style={{ fontSize:22,fontWeight:900,lineHeight:1,color:sc>os[si]?C.text:"#444466" }}>{sc}</div>
                <div style={{ fontSize:9,color:"#333355",fontWeight:700 }}>S{si+1}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShareBtn({ getText }) {
  const share = () => {
    const text = getText();
    try { navigator.clipboard.writeText(text); } catch(e) {}
    setTimeout(()=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank"),200);
  };
  return (
    <button onClick={share} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 16px",background:"#25d366",border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Share to WhatsApp
    </button>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selPlayer, setSelPlayer] = useState(null);
  const [selTeam, setSelTeam] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [schedule, setSchedule] = useState(SCHEDULE);
  const [fixtures, setFixtures] = useState(UPCOMING_FIXTURES);
  const [toast, setToast] = useState("");
  const [inputScores, setInputScores] = useState({});
  const [newFixture, setNewFixture] = useState({ date:"",time:"",venue:"",teams:"" });
  const [showAddFixture, setShowAddFixture] = useState(false);

  const TODAY = new Date("2026-07-09");
  const activeFixtures = fixtures.filter(f=>new Date(f.date)>=TODAY);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2500); };
  const handlePin = k => {
    if(k==="⌫"){setPin(p=>p.slice(0,-1));return;}
    if(pin.length>=4)return;
    const next=pin+k; setPin(next);
    if(next.length===4) setTimeout(()=>{ if(next===ADMIN_PIN){setAdminMode(true);setPinModal(false);setPin("");setPinErr(false);showToast("Admin mode on ✓");}else{setPinErr(true);setPin("");setTimeout(()=>setPinErr(false),800);}},120);
  };

  const standings = useMemo(()=>calcTeamStandings(schedule),[schedule]);
  const s1stats = useMemo(()=>calcStats(SEASON1),[]);
  const s2stats = useMemo(()=>calcStats(SEASON2),[]);

  const saveResult = (ri,mi) => {
    const key=`${ri}-${mi}`, val=inputScores[key]||"";
    const parts=val.split(",").map(s=>s.trim());
    let s1=0,s2=0;
    const valid=parts.length>=2&&parts.every(p=>{const[a,b]=p.split("-").map(Number);if(isNaN(a)||isNaN(b))return false;if(a>b)s1++;else s2++;return true;});
    if(!valid){showToast("Format: 6-4, 3-6, 6-2");return;}
    setSchedule(prev=>{const ns=JSON.parse(JSON.stringify(prev));ns[ri].matches[mi].scores=parts;ns[ri].matches[mi].result=[s1,s2];return ns;});
    showToast("Result saved ✓");
  };

  const addFixture = () => {
    if(!newFixture.date||!newFixture.teams){showToast("Date and teams required");return;}
    setFixtures(prev=>[...prev,{...newFixture,id:`f${Date.now()}`}]);
    setNewFixture({date:"",time:"",venue:"",teams:""});
    setShowAddFixture(false);
    showToast("Fixture added ✓");
  };

  const getT = id => TEAMS.find(t=>t.id===id);

  const NAV = [
    {id:"home",label:"Home",icon:"🏠"},
    {id:"upcoming",label:"Upcoming",icon:"📆"},
    {id:"dpl",label:"DPL Season 3",icon:"🏆"},
    {id:"s2",label:"Season 2",icon:"📅"},
    {id:"s1",label:"Season 1",icon:"📜"},
    {id:"players",label:"Players",icon:"👥"},
    {id:"teams",label:"Teams",icon:"🛡"},
  ];

  const waS2 = () => {
    let t=`🎾 *DEGENERATES PADEL LEAGUE*\n*Season 2 Standings*\n\n`;
    s2stats.forEach((p,i)=>t+=`${i+1}. ${p.name} — ${p.w}W ${p.l}L\n`);
    const latest=SEASON2.filter(m=>m.week===Math.max(...SEASON2.map(x=>x.week)));
    t+=`\n📅 *Week ${latest[0]?.week} Results*\n`;
    latest.forEach(m=>{const w=[m.p1,m.p2];const s=`${m.s[0]}-${m.s[1]}, ${m.s[2]}-${m.s[3]}, ${m.s[4]}-${m.s[5]}`;t+=`✅ ${w[0]} & ${w[1]} won (${s})\n`;});
    return t;
  };
  const waS1 = () => {
    let t=`🎾 *DEGENERATES PADEL LEAGUE*\n*Season 1 Final Standings*\n\n`;
    s1stats.forEach((p,i)=>t+=`${i+1}. ${p.name} — ${p.w}W ${p.l}L\n`);
    return t;
  };
  const waDPL = () => {
    let t=`🎾 *DEGENERATES PADEL LEAGUE*\n*Season 3 Pool Standings*\n\n`;
    standings.forEach((tm,i)=>t+=`${i+1}. ${tm.name} — ${tm.pts} pts (${tm.sw}-${tm.sl} sets)\n`);
    return t;
  };

  const cardStyle = { background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden" };
  const weekGroups = arr => [...new Set(arr.map(m=>m.week))].sort((a,b)=>b-a);

  return (
    <div style={{ minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','system-ui',sans-serif",paddingBottom:80 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1e1e2e;border-radius:4px}input,select,textarea{background:#1a1a2e!important;color:#e2e8f0!important;border:1px solid #2d2d4e!important;border-radius:8px;padding:8px 12px;font-family:inherit;font-size:13px;outline:none;width:100%}input:focus,select:focus{border-color:#00d4ff!important}`}</style>

      {toast&&<div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.accent,color:"#0a0a0f",padding:"10px 24px",borderRadius:12,fontSize:13,fontWeight:800,zIndex:999,whiteSpace:"nowrap" }}>{toast}</div>}

      {pinModal&&(
        <div style={{ position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)" }}>
          <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:24,padding:32,width:280 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:24 }}>
              <span style={{ fontWeight:900,fontSize:16 }}>Admin PIN</span>
              <button onClick={()=>{setPinModal(false);setPin("");}} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18 }}>✕</button>
            </div>
            <div style={{ display:"flex",justifyContent:"center",gap:10,marginBottom:24 }}>
              {[0,1,2,3].map(i=><div key={i} style={{ width:44,height:44,borderRadius:12,border:`2px solid ${pin.length>i?(pinErr?"#ff5252":C.accent):C.border}`,background:pin.length>i?(pinErr?"#ff525222":`${C.accent}22`):"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:pinErr?"#ff5252":C.accent,fontSize:20,fontWeight:900 }}>{pin.length>i?"●":""}</div>)}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
              {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>k===""?<div key={i}/>:<button key={i} onClick={()=>handlePin(String(k))} style={{ height:48,borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontWeight:900,fontSize:18,cursor:"pointer",fontFamily:"inherit" }}>{k}</button>)}
            </div>
            {pinErr&&<p style={{ textAlign:"center",color:"#ff5252",fontSize:11,fontWeight:800,marginTop:12 }}>Wrong PIN</p>}
          </div>
        </div>
      )}

      <nav style={{ background:`${C.card}f0`,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)" }}>
        <div style={{ maxWidth:1000,margin:"0 auto",padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
            {LOGO_SQUARE_URL ? (
              <img src={LOGO_SQUARE_URL} alt="DPL logo" style={{ width:36,height:36,borderRadius:10,objectFit:"cover" }}/>
            ) : (
              <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🎾</div>
            )}
            <span style={{ fontWeight:900,fontSize:15,letterSpacing:"-0.03em",color:C.accent }}>DPL</span>
          </div>
          <div style={{ display:"flex",gap:2,overflowX:"auto",flex:1 }}>
            {NAV.map(n=><button key={n.id} onClick={()=>{setView(n.id);setSelPlayer(null);setSelTeam(null);}} style={{ padding:"6px 10px",borderRadius:8,border:"none",background:view===n.id?`${C.accent}22`:"transparent",color:view===n.id?C.accent:C.muted,cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap" }}>{n.icon} {n.label}</button>)}
          </div>
          <button onClick={()=>adminMode?setAdminMode(false):setPinModal(true)} style={{ padding:"6px 12px",borderRadius:8,border:`1px solid ${adminMode?"#00e67655":C.border}`,background:adminMode?"#00e67611":"transparent",color:adminMode?"#00e676":C.muted,cursor:"pointer",fontWeight:800,fontSize:11,fontFamily:"inherit",flexShrink:0 }}>
            {adminMode?"🛡 Admin":"🔒"}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth:1000,margin:"0 auto",padding:"20px 16px" }}>

        {/* HOME */}
        {view==="home"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
            {/* HERO */}
            <div style={{ borderRadius:24,border:`1px solid #00d4ff22`,overflow:"hidden",position:"relative",background:C.card }}>
              <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%, #00d4ff0d 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #7c3aed0d 0%, transparent 60%)",pointerEvents:"none" }}/>
              <div style={{ padding:"48px 32px",display:"flex",alignItems:"center",gap:32,flexWrap:"wrap" }}>
                <div style={{ flex:1,minWidth:260 }}>
                  {LOGO_BANNER_URL&&(
                    <img src={LOGO_BANNER_URL} alt="Degenerates Padel League banner" style={{ maxWidth:"100%",height:"auto",maxHeight:100,marginBottom:20,display:"block" }}/>
                  )}
                  <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"#00d4ff11",border:"1px solid #00d4ff33",borderRadius:99,padding:"5px 14px",marginBottom:16 }}>
                    <span style={{ width:7,height:7,borderRadius:"50%",background:C.accent,display:"inline-block",boxShadow:`0 0 8px ${C.accent}` }}/>
                    <span style={{ fontSize:11,fontWeight:800,color:C.accent,textTransform:"uppercase",letterSpacing:"0.1em" }}>Season 3 Underway</span>
                  </div>
                  <h1 style={{ fontSize:42,fontWeight:900,lineHeight:1.05,letterSpacing:"-0.04em",marginBottom:12 }}>
                    <span style={{ background:"linear-gradient(135deg,#00d4ff,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>DEGENERATES</span>
                    <br/><span style={{ color:C.text }}>PADEL LEAGUE</span>
                  </h1>
                  <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginTop:24 }}>
                    <button onClick={()=>setView("dpl")} style={{ padding:"10px 22px",background:C.accent,border:"none",borderRadius:12,color:"#0a0a0f",fontWeight:900,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>Season 3 →</button>
                    <button onClick={()=>setView("upcoming")} style={{ padding:"10px 22px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>Upcoming Games</button>
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,minWidth:200 }}>
                  {[{v:"46",l:"Matches",c:C.accent},{v:"3",l:"Seasons",c:C.gold},{v:"9",l:"Players",c:C.green},{v:"4",l:"DPL Teams",c:"#a78bfa"}].map(s=>(
                    <div key={s.l} style={{ background:`${s.c}0d`,border:`1px solid ${s.c}22`,borderRadius:14,padding:"16px 12px",textAlign:"center" }}>
                      <div style={{ fontSize:30,fontWeight:900,color:s.c,lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:10,color:`${s.c}99`,fontWeight:800,textTransform:"uppercase",marginTop:4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PLAYER GRID */}
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
                <h3 style={{ fontSize:16,fontWeight:800,color:C.text }}>👥 The Squad</h3>
                <button onClick={()=>setView("players")} style={{ fontSize:11,color:C.accent,background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"inherit" }}>View all stats →</button>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12 }}>
                {ALL_PLAYERS.map(p=>{
                  const photo=PLAYER_PHOTOS[p], col=pColor(p);
                  const s1=s1stats.find(x=>x.name===p)||{w:0,l:0}, s2=s2stats.find(x=>x.name===p)||{w:0,l:0};
                  return (
                    <div key={p} onClick={()=>{setSelPlayer(p);setView("players");}} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"border-color 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=col}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{ height:90,background:`${col}11`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                        {photo ? <img src={photo} alt={p} style={{ width:72,height:72,borderRadius:"50%",objectFit:"cover",border:`3px solid ${col}` }}/> : <Avatar name={p} size={72} ring/>}
                        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:24,background:`linear-gradient(transparent,${C.card})` }}/>
                      </div>
                      <div style={{ padding:"10px 12px" }}>
                        <div style={{ fontWeight:800,fontSize:13,color:C.text,marginBottom:4 }}>{p}</div>
                        <div style={{ display:"flex",justifyContent:"space-between" }}>
                          <span style={{ fontSize:11,color:C.green,fontWeight:700 }}>{s1.w+s2.w}W</span>
                          <span style={{ fontSize:11,color:C.red,fontWeight:700 }}>{s1.l+s2.l}L</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DPL TEAMS */}
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
                <h3 style={{ fontSize:16,fontWeight:800 }}>🏆 DPL Season 3 Teams</h3>
                <button onClick={()=>setView("dpl")} style={{ fontSize:11,color:C.accent,background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"inherit" }}>View standings →</button>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12 }}>
                {TEAMS.map(t=>(
                  <div key={t.id} onClick={()=>{setSelTeam(t.id);setView("teams");}} style={{ background:C.card,border:`1px solid ${t.color}33`,borderRadius:16,padding:18,cursor:"pointer",transition:"all 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=t.color}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=`${t.color}33`}>
                    <div style={{ fontSize:28,marginBottom:8 }}>{t.emoji}</div>
                    <div style={{ fontWeight:900,fontSize:15,color:t.color,marginBottom:4 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:C.muted }}>{t.p1} & {t.p2}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPCOMING FIXTURES */}
        {view==="upcoming"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <div style={{ ...cardStyle,border:`1px solid #f9731633`,padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
                <div>
                  <div style={{ fontSize:11,fontWeight:800,color:C.orange,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Live Schedule</div>
                  <h2 style={{ fontSize:24,fontWeight:900,letterSpacing:"-0.03em" }}>Upcoming Games</h2>
                  <p style={{ fontSize:13,color:C.muted,marginTop:4 }}>Auto-removes past fixtures · {activeFixtures.length} upcoming</p>
                </div>
                {adminMode&&<button onClick={()=>setShowAddFixture(!showAddFixture)} style={{ padding:"8px 18px",background:C.orange,border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>+ Add Fixture</button>}
              </div>
              {adminMode&&showAddFixture&&(
                <div style={{ marginTop:16,padding:16,background:C.surface,borderRadius:12,display:"flex",flexDirection:"column",gap:10 }}>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <div><label style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:4 }}>Date</label><input type="date" value={newFixture.date} onChange={e=>setNewFixture(p=>({...p,date:e.target.value}))}/></div>
                    <div><label style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:4 }}>Time</label><input type="time" value={newFixture.time} onChange={e=>setNewFixture(p=>({...p,time:e.target.value}))}/></div>
                  </div>
                  <div><label style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:4 }}>Venue</label><input placeholder="e.g. Africa Padel KCC" value={newFixture.venue} onChange={e=>setNewFixture(p=>({...p,venue:e.target.value}))}/></div>
                  <div><label style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:4 }}>Teams / Description</label><input placeholder="e.g. Team A vs Team B" value={newFixture.teams} onChange={e=>setNewFixture(p=>({...p,teams:e.target.value}))}/></div>
                  <button onClick={addFixture} style={{ padding:"9px",background:C.orange,border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>Save Fixture</button>
                </div>
              )}
            </div>
            {activeFixtures.length===0?(
              <div style={{ textAlign:"center",padding:"60px 20px",color:C.muted }}>
                <div style={{ fontSize:40,marginBottom:12 }}>🗓</div>
                <div style={{ fontWeight:800,fontSize:15,marginBottom:6,color:C.text }}>No upcoming fixtures</div>
                <div style={{ fontSize:13 }}>All past fixtures have been removed automatically</div>
              </div>
            ):(
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {activeFixtures.map(f=>{
                  const daysUntil=Math.ceil((new Date(f.date)-TODAY)/(1000*60*60*24));
                  return (
                    <div key={f.id} style={{ background:C.card,border:`1px solid ${daysUntil<=3?"#f9731655":C.border}`,borderRadius:14,padding:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
                      <div style={{ display:"flex",gap:16,alignItems:"center" }}>
                        <div style={{ background:daysUntil<=3?"#f9731611":C.surface,border:`1px solid ${daysUntil<=3?"#f9731633":C.border}`,borderRadius:12,padding:"10px 14px",textAlign:"center",minWidth:56 }}>
                          <div style={{ fontSize:18,fontWeight:900,color:daysUntil<=3?C.orange:C.accent,lineHeight:1 }}>{new Date(f.date).getDate()}</div>
                          <div style={{ fontSize:9,fontWeight:800,color:C.muted,textTransform:"uppercase" }}>{new Date(f.date).toLocaleString("default",{month:"short"})}</div>
                        </div>
                        <div>
                          <div style={{ fontWeight:800,fontSize:14,color:C.text,marginBottom:4 }}>{f.teams}</div>
                          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                            {f.time&&<span style={{ fontSize:11,color:C.muted }}>🕐 {f.time}</span>}
                            {f.venue&&<span style={{ fontSize:11,color:C.muted }}>📍 {f.venue}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <span style={{ fontSize:11,fontWeight:800,color:daysUntil<=3?C.orange:C.muted,background:daysUntil<=3?"#f9731611":C.surface,border:`1px solid ${daysUntil<=3?"#f9731633":C.border}`,borderRadius:8,padding:"4px 10px" }}>
                          {daysUntil===0?"Today":daysUntil===1?"Tomorrow":`${daysUntil} days`}
                        </span>
                        {adminMode&&<button onClick={()=>setFixtures(p=>p.filter(x=>x.id!==f.id))} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,padding:"4px" }}>🗑</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DPL SEASON 3 */}
        {view==="dpl"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ ...cardStyle,border:`1px solid ${C.gold}44`,padding:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
              <div>
                <div style={{ fontSize:11,fontWeight:800,color:C.gold,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Degenerates Padel League</div>
                <h2 style={{ fontSize:24,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Season 3 — Pool Stage</h2>
                <p style={{ fontSize:13,color:C.muted }}>Best of 3 sets · Round Robin · Win 2-0=3pts, 2-1=2pts, 1-2=1pt, 0-2=0pts</p>
              </div>
              <ShareBtn getText={waDPL}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={cardStyle}>
                <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:`${C.gold}0d` }}>
                  <span style={{ fontSize:11,fontWeight:800,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em" }}>📊 Pool Standings</span>
                </div>
                <table style={{ width:"100%",borderCollapse:"collapse" }}>
                  <thead><tr style={{ borderBottom:`1px solid ${C.border}` }}>
                    {["#","Team","P","Pts","SD"].map(h=><th key={h} style={{ padding:"8px 10px",fontSize:9,fontWeight:800,color:C.muted,textTransform:"uppercase",textAlign:h==="Team"?"left":"center" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {standings.map((t,i)=>(
                      <tr key={t.id} style={{ borderBottom:`1px solid ${C.border}33` }}>
                        <td style={{ padding:"10px",textAlign:"center",fontSize:14 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</td>
                        <td style={{ padding:"10px 8px" }}>
                          <div style={{ fontWeight:800,fontSize:12,color:t.color }}>{t.emoji} {t.name}</div>
                          <div style={{ fontSize:10,color:C.muted }}>{t.p1} & {t.p2}</div>
                        </td>
                        <td style={{ textAlign:"center",fontSize:12,color:C.muted }}>{t.played}</td>
                        <td style={{ textAlign:"center",fontSize:14,fontWeight:900,color:C.gold }}>{t.pts}</td>
                        <td style={{ textAlign:"center",fontSize:12,color:t.sw>=t.sl?C.green:C.red,fontWeight:700 }}>{t.played>0?`${t.sw>t.sl?"+":""}${t.sw-t.sl}`:"-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={cardStyle}>
                <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#7c3aed11" }}>
                  <span style={{ fontSize:11,fontWeight:800,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"0.08em" }}>⚡ Knockout Stage</span>
                </div>
                <div style={{ padding:16,display:"flex",flexDirection:"column",gap:10 }}>
                  <div style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em" }}>Semi-Finals — 4 Aug 2026</div>
                  {[{l:"Semi A",d:"1st vs 4th Place"},{l:"Semi B",d:"2nd vs 3rd Place"}].map(s=>(
                    <div key={s.l} style={{ background:"#7c3aed11",border:"1px solid #7c3aed33",borderRadius:10,padding:12 }}>
                      <span style={{ fontSize:11,fontWeight:800,color:"#a78bfa" }}>{s.l}</span>
                      <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>{s.d}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:4 }}>Finals — 11 Aug 2026</div>
                  <div style={{ background:`${C.gold}11`,border:`1px solid ${C.gold}33`,borderRadius:10,padding:12 }}>
                    <div style={{ fontSize:11,fontWeight:800,color:C.gold }}>🏆 Grand Final</div>
                    <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Winner Semi A vs Winner Semi B</div>
                  </div>
                  <div style={{ background:"#ff525211",border:"1px solid #ff525233",borderRadius:10,padding:12 }}>
                    <div style={{ fontSize:11,fontWeight:800,color:"#ff5252" }}>💩 Toilet Bowl</div>
                    <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Loser Semi A vs Loser Semi B</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:11,fontWeight:800,color:C.accent,textTransform:"uppercase",letterSpacing:"0.08em" }}>📅 Round Robin Schedule</span>
              </div>
              {schedule.map((round,ri)=>(
                <div key={ri} style={{ borderBottom:`1px solid ${C.border}33` }}>
                  <div style={{ padding:"9px 16px",background:`${C.accent}08`,display:"flex",gap:10,alignItems:"center" }}>
                    <span style={{ fontSize:11,fontWeight:800,color:C.accent }}>Round {round.round}</span>
                    <span style={{ fontSize:11,color:C.muted }}>· {round.date}</span>
                  </div>
                  {round.matches.map((m,mi)=>{
                    const t1=getT(m.t1),t2=getT(m.t2),key=`${ri}-${mi}`;
                    return (
                      <div key={mi} style={{ padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:mi<round.matches.length-1?`1px solid ${C.border}22`:"none",flexWrap:"wrap" }}>
                        <div style={{ flex:1,display:"flex",alignItems:"center",gap:10,minWidth:200 }}>
                          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                            <span style={{ fontSize:18 }}>{t1.emoji}</span>
                            <span style={{ fontSize:10,fontWeight:800,color:t1.color,whiteSpace:"nowrap" }}>{t1.name}</span>
                            <span style={{ fontSize:9,color:C.muted }}>{t1.p1} & {t1.p2}</span>
                          </div>
                          <span style={{ color:C.muted,fontSize:12,fontWeight:700,padding:"0 8px" }}>vs</span>
                          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                            <span style={{ fontSize:18 }}>{t2.emoji}</span>
                            <span style={{ fontSize:10,fontWeight:800,color:t2.color,whiteSpace:"nowrap" }}>{t2.name}</span>
                            <span style={{ fontSize:9,color:C.muted }}>{t2.p1} & {t2.p2}</span>
                          </div>
                        </div>
                        {m.scores?(
                          <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
                            {m.scores.map((sc,si)=><span key={si} style={{ fontSize:13,fontWeight:800,background:C.surface,borderRadius:6,padding:"3px 10px" }}>{sc}</span>)}
                            <span style={{ fontSize:11,fontWeight:800,color:m.result[0]>m.result[1]?t1.color:t2.color,background:C.surface,borderRadius:8,padding:"4px 12px" }}>
                              {m.result[0]>m.result[1]?`${t1.name} wins`:`${t2.name} wins`}
                            </span>
                          </div>
                        ):adminMode?(
                          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                            <input placeholder="6-4, 3-6, 6-2" value={inputScores[key]||""} onChange={e=>setInputScores(p=>({...p,[key]:e.target.value}))} style={{ width:130 }}/>
                            <button onClick={()=>saveResult(ri,mi)} style={{ padding:"7px 16px",background:C.accent,border:"none",borderRadius:8,color:"#0a0a0f",fontWeight:800,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>Save</button>
                          </div>
                        ):<span style={{ fontSize:11,color:C.muted,background:`${C.accent}0d`,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"4px 12px" }}>Upcoming</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEASON 2 */}
        {view==="s2"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ ...cardStyle,padding:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
              <div>
                <div style={{ fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Archive</div>
                <h2 style={{ fontSize:24,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Season 2</h2>
                <p style={{ fontSize:13,color:C.muted }}>Individual format · 7 weeks · 14 matches</p>
              </div>
              <ShareBtn getText={waS2}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12 }}>
              {s2stats.slice(0,3).map((p,i)=>(
                <div key={p.name} style={{ background:C.card,border:`1px solid ${[C.gold,C.silver,C.bronze][i]}44`,borderRadius:16,padding:16,display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:28 }}>{["🥇","🥈","🥉"][i]}</span>
                  <Avatar name={p.name} size={44}/>
                  <div>
                    <div style={{ fontWeight:900,fontSize:15,color:[C.gold,C.silver,C.bronze][i] }}>{p.name}</div>
                    <div style={{ fontSize:12,color:C.muted,fontWeight:700 }}>{p.w}W — {p.l}L</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:`${C.accent}08`,border:`1px solid ${C.accent}22`,borderRadius:14,padding:"12px 16px" }}>
              <div style={{ fontWeight:800,fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>Season 2 Standings</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:6 }}>
                {s2stats.map((p,i)=>(
                  <div key={p.name} style={{ display:"flex",alignItems:"center",gap:8,background:C.card,borderRadius:10,padding:"8px 12px",border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13,minWidth:20,fontWeight:800,color:C.muted }}>{i+1}</span>
                    <Avatar name={p.name} size={28}/>
                    <div>
                      <div style={{ fontSize:12,fontWeight:800 }}>{p.name}</div>
                      <div style={{ fontSize:10,color:C.green,fontWeight:700 }}>{p.w}W {p.l}L</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {weekGroups(SEASON2).map(week=>(
              <div key={week}>
                <div style={{ display:"flex",alignItems:"center",gap:10,margin:"4px 0 10px" }}>
                  <div style={{ flex:1,height:1,background:C.border }}/>
                  <span style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em" }}>Week {week} · {SEASON2.find(m=>m.week===week)?.date}</span>
                  <div style={{ flex:1,height:1,background:C.border }}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10 }}>
                  {SEASON2.filter(m=>m.week===week).map((m,i)=><MatchCard key={i} m={m} accent={C.accent}/>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEASON 1 */}
        {view==="s1"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ ...cardStyle,padding:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
              <div>
                <div style={{ fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Archive</div>
                <h2 style={{ fontSize:24,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Season 1</h2>
                <p style={{ fontSize:13,color:C.muted }}>Individual format · 11 weeks · 21 matches</p>
              </div>
              <ShareBtn getText={waS1}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12 }}>
              {s1stats.slice(0,3).map((p,i)=>(
                <div key={p.name} style={{ background:C.card,border:`1px solid ${[C.gold,C.silver,C.bronze][i]}44`,borderRadius:16,padding:16,display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:28 }}>{["🥇","🥈","🥉"][i]}</span>
                  <Avatar name={p.name} size={44}/>
                  <div>
                    <div style={{ fontWeight:900,fontSize:15,color:[C.gold,C.silver,C.bronze][i] }}>{p.name}</div>
                    <div style={{ fontSize:12,color:C.muted,fontWeight:700 }}>{p.w}W — {p.l}L</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:`${C.gold}08`,border:`1px solid ${C.gold}22`,borderRadius:14,padding:"12px 16px" }}>
              <div style={{ fontWeight:800,fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>Season 1 Standings</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:6 }}>
                {s1stats.map((p,i)=>(
                  <div key={p.name} style={{ display:"flex",alignItems:"center",gap:8,background:C.card,borderRadius:10,padding:"8px 12px",border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13,minWidth:20,fontWeight:800,color:C.muted }}>{i+1}</span>
                    <Avatar name={p.name} size={28}/>
                    <div>
                      <div style={{ fontSize:12,fontWeight:800 }}>{p.name}</div>
                      <div style={{ fontSize:10,color:C.green,fontWeight:700 }}>{p.w}W {p.l}L</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {weekGroups(SEASON1).map(week=>(
              <div key={week}>
                <div style={{ display:"flex",alignItems:"center",gap:10,margin:"4px 0 10px" }}>
                  <div style={{ flex:1,height:1,background:C.border }}/>
                  <span style={{ fontSize:10,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em" }}>Week {week} · {SEASON1.find(m=>m.week===week)?.date}</span>
                  <div style={{ flex:1,height:1,background:C.border }}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10 }}>
                  {SEASON1.filter(m=>m.week===week).map((m,i)=><MatchCard key={i} m={m} accent={C.gold}/>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PLAYERS */}
        {view==="players"&&!selPlayer&&(
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ ...cardStyle,padding:20 }}>
              <h2 style={{ fontSize:24,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Player Profiles</h2>
              <p style={{ fontSize:13,color:C.muted }}>All-time stats across Season 1 & 2</p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12 }}>
              {ALL_PLAYERS.map(p=>{
                const s1=s1stats.find(x=>x.name===p)||{w:0,l:0,played:0};
                const s2=s2stats.find(x=>x.name===p)||{w:0,l:0,played:0};
                const total=s1.w+s2.w, played=s1.played+s2.played, col=pColor(p);
                return (
                  <div key={p} onClick={()=>setSelPlayer(p)} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=col}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div style={{ height:80,background:`${col}0d`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Avatar name={p} size={60} ring/>
                    </div>
                    <div style={{ padding:"12px 14px" }}>
                      <div style={{ fontWeight:900,fontSize:14,marginBottom:10 }}>{p}</div>
                      <div style={{ display:"flex",gap:6 }}>
                        {[{v:total,l:"W",c:C.green,bg:"#00e67611"},{v:s1.l+s2.l,l:"L",c:C.red,bg:"#ff525211"},{v:played>0?`${Math.round(total/played*100)}%`:"—",l:"W%",c:col,bg:`${col}11`}].map(st=>(
                          <div key={st.l} style={{ flex:1,background:st.bg,borderRadius:8,padding:"7px 4px",textAlign:"center" }}>
                            <div style={{ fontSize:16,fontWeight:900,color:st.c }}>{st.v}</div>
                            <div style={{ fontSize:8,fontWeight:800,color:`${st.c}88`,textTransform:"uppercase" }}>{st.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view==="players"&&selPlayer&&(()=>{
          const p=selPlayer, col=pColor(p);
          const s1=s1stats.find(x=>x.name===p)||{w:0,l:0,played:0};
          const s2=s2stats.find(x=>x.name===p)||{w:0,l:0,played:0};
          const allM=[...SEASON1,...SEASON2].filter(m=>[m.p1,m.p2,m.p3,m.p4].includes(p));
          const dplTeam=TEAMS.find(t=>t.p1===p||t.p2===p);
          const waPlayer=()=>{
            let t=`🎾 *${p} — DPL Profile*\nAll-time: ${s1.w+s2.w}W ${s1.l+s2.l}L\nWin rate: ${s1.played+s2.played>0?Math.round((s1.w+s2.w)/(s1.played+s2.played)*100):0}%`;
            if(dplTeam) t+=`\nDPL Team: ${dplTeam.name}`;
            return t;
          };
          return (
            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <button onClick={()=>setSelPlayer(null)} style={{ alignSelf:"flex-start",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>← Players</button>
              <div style={{ background:C.card,border:`1px solid ${col}44`,borderRadius:20,padding:24,position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-60,right:-60,width:200,height:200,background:`radial-gradient(circle,${col}0d,transparent 70%)`,pointerEvents:"none" }}/>
                <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:20,flexWrap:"wrap" }}>
                  <Avatar name={p} size={72} ring/>
                  <div>
                    <h2 style={{ fontSize:28,fontWeight:900,letterSpacing:"-0.03em",color:col }}>{p}</h2>
                    {dplTeam&&<div style={{ fontSize:12,color:dplTeam.color,fontWeight:700,marginTop:4 }}>{dplTeam.emoji} {dplTeam.name}</div>}
                    <div style={{ display:"flex",gap:8,marginTop:10,flexWrap:"wrap" }}>
                      {PLAYTOMIC_LINKS[p]&&<a href={PLAYTOMIC_LINKS[p]} target="_blank" rel="noopener noreferrer" style={{ fontSize:11,color:C.accent,background:`${C.accent}11`,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"5px 12px",textDecoration:"none",fontWeight:700 }}>🎾 Playtomic</a>}
                      <ShareBtn getText={waPlayer}/>
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
                  {[{l:"S1 Wins",v:s1.w,c:C.gold},{l:"S2 Wins",v:s2.w,c:col},{l:"Total Wins",v:s1.w+s2.w,c:C.green},{l:"Win Rate",v:`${s1.played+s2.played>0?Math.round((s1.w+s2.w)/(s1.played+s2.played)*100):0}%`,c:C.accent}].map(st=>(
                    <div key={st.l} style={{ background:`${st.c}0d`,border:`1px solid ${st.c}22`,borderRadius:12,padding:14,textAlign:"center" }}>
                      <div style={{ fontSize:24,fontWeight:900,color:st.c }}>{st.v}</div>
                      <div style={{ fontSize:9,color:`${st.c}88`,fontWeight:800,textTransform:"uppercase",marginTop:2 }}>{st.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={cardStyle}>
                <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em" }}>Match History (last 8)</span>
                </div>
                {allM.slice(-8).reverse().map((m,i)=>{
                  const onWin=[m.p1,m.p2].includes(p)?m.w===1:m.w===2;
                  const partner=[m.p1,m.p2].includes(p)?[m.p1,m.p2].find(x=>x!==p):[m.p3,m.p4].find(x=>x!==p);
                  const opp=[m.p1,m.p2].includes(p)?`${m.p3} & ${m.p4}`:`${m.p1} & ${m.p2}`;
                  return (
                    <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${C.border}22`,background:onWin?"#00e67606":"transparent" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <span style={{ fontSize:14 }}>{onWin?"✅":"❌"}</span>
                        <div>
                          <div style={{ fontSize:12,fontWeight:700 }}>w/ {partner} vs {opp}</div>
                          <div style={{ fontSize:10,color:C.muted }}>Wk {m.week} · {m.date}</div>
                        </div>
                      </div>
                      <span style={{ fontSize:11,fontWeight:800,color:onWin?C.green:C.red,background:onWin?"#00e67611":"#ff525211",borderRadius:8,padding:"3px 10px" }}>{onWin?"WIN":"LOSS"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* TEAMS */}
        {view==="teams"&&!selTeam&&(
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ ...cardStyle,padding:20 }}>
              <h2 style={{ fontSize:24,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>DPL Teams</h2>
              <p style={{ fontSize:13,color:C.muted }}>Season 3 team profiles</p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16 }}>
              {TEAMS.map(t=>{
                const ts=standings.find(x=>x.id===t.id);
                return (
                  <div key={t.id} onClick={()=>setSelTeam(t.id)} style={{ background:C.card,border:`1px solid ${t.color}33`,borderRadius:20,padding:24,cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=t.color}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=`${t.color}33`}>
                    <div style={{ fontSize:36,marginBottom:12 }}>{t.emoji}</div>
                    <div style={{ fontWeight:900,fontSize:17,color:t.color,marginBottom:4 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:C.muted,marginBottom:14 }}>{t.p1} & {t.p2}</div>
                    <div style={{ display:"flex",gap:8,marginBottom:14 }}>
                      <Avatar name={t.p1} size={34}/><Avatar name={t.p2} size={34}/>
                    </div>
                    <div style={{ padding:"8px 12px",background:`${t.color}0d`,borderRadius:10,display:"flex",justifyContent:"space-between" }}>
                      <span style={{ fontSize:11,color:C.muted }}>Points</span>
                      <span style={{ fontSize:14,fontWeight:900,color:t.color }}>{ts?.pts||0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view==="teams"&&selTeam&&(()=>{
          const t=TEAMS.find(x=>x.id===selTeam);
          const ts=standings.find(x=>x.id===selTeam);
          const teamM=schedule.flatMap(r=>r.matches.filter(m=>m.t1===selTeam||m.t2===selTeam));
          const played=teamM.filter(m=>m.scores);
          const wins=played.filter(m=>(m.t1===selTeam&&m.result[0]>m.result[1])||(m.t2===selTeam&&m.result[1]>m.result[0]));
          const waTeam=()=>`🎾 *${t.name}*\n${t.p1} & ${t.p2}\nDPL Season 3\nPoints: ${ts?.pts||0} | Sets: ${ts?.sw||0}-${ts?.sl||0}`;
          return (
            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <button onClick={()=>setSelTeam(null)} style={{ alignSelf:"flex-start",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>← Teams</button>
              <div style={{ background:C.card,border:`1px solid ${t.color}44`,borderRadius:20,padding:24,position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-40,right:-40,width:180,height:180,background:`radial-gradient(circle,${t.color}0d,transparent 70%)`,pointerEvents:"none" }}/>
                <div style={{ fontSize:48,marginBottom:12 }}>{t.emoji}</div>
                <h2 style={{ fontSize:28,fontWeight:900,color:t.color,marginBottom:4 }}>{t.name}</h2>
                <div style={{ fontSize:13,color:C.muted,marginBottom:20 }}>DPL Season 3</div>
                <div style={{ display:"flex",gap:10,marginBottom:20,flexWrap:"wrap" }}>
                  {[t.p1,t.p2].map(p=>(
                    <div key={p} onClick={()=>{setSelPlayer(p);setView("players");}} style={{ display:"flex",alignItems:"center",gap:8,background:`${t.color}11`,border:`1px solid ${t.color}33`,borderRadius:12,padding:"8px 14px",cursor:"pointer" }}>
                      <Avatar name={p} size={30}/><span style={{ fontWeight:800,fontSize:13,color:t.color }}>{p}</span>
                    </div>
                  ))}
                  <ShareBtn getText={waTeam}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
                  {[{l:"Points",v:ts?.pts||0,c:C.gold},{l:"Played",v:played.length,c:C.accent},{l:"Wins",v:wins.length,c:C.green},{l:"Set Diff",v:(ts?.sw||0)-(ts?.sl||0),c:t.color}].map(st=>(
                    <div key={st.l} style={{ background:`${st.c}0d`,border:`1px solid ${st.c}22`,borderRadius:12,padding:14,textAlign:"center" }}>
                      <div style={{ fontSize:22,fontWeight:900,color:st.c }}>{st.v}</div>
                      <div style={{ fontSize:9,color:`${st.c}88`,fontWeight:800,textTransform:"uppercase",marginTop:2 }}>{st.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={cardStyle}>
                <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em" }}>DPL Matches</span>
                </div>
                {teamM.map((m,i)=>{
                  const opp=TEAMS.find(x=>x.id===(m.t1===selTeam?m.t2:m.t1));
                  const won=m.scores&&((m.t1===selTeam&&m.result[0]>m.result[1])||(m.t2===selTeam&&m.result[1]>m.result[0]));
                  return (
                    <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:`1px solid ${C.border}22`,background:won?"#00e67606":"transparent" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <span style={{ fontSize:14 }}>{opp?.emoji}</span>
                        <div>
                          <div style={{ fontSize:12,fontWeight:700 }}>vs {opp?.name}</div>
                          <div style={{ fontSize:10,color:C.muted }}>Round {schedule.findIndex(r=>r.matches.includes(m))+1}</div>
                        </div>
                      </div>
                      {m.scores?(
                        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                          {m.scores.map((sc,si)=><span key={si} style={{ fontSize:12,fontWeight:800,background:C.surface,borderRadius:6,padding:"2px 8px" }}>{sc}</span>)}
                          <span style={{ fontSize:11,fontWeight:800,color:won?C.green:C.red,background:won?"#00e67611":"#ff525211",borderRadius:8,padding:"3px 10px" }}>{won?"WIN":"LOSS"}</span>
                        </div>
                      ):<span style={{ fontSize:11,color:C.muted }}>Upcoming</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </main>
    </div>
  );
}
