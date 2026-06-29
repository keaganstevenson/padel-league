import { useState, useMemo } from "react";

const TrophyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
const ShieldIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ShareIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const ADMIN_PIN = "1234";
const INITIAL_PLAYERS = ["Brandon","Byron","Connor","Darren","Graeme","John","Keagan","Michael","Nathan","Shaun"];

const C = {
  bg:'#f5f0eb', surface:'#ffffff', border:'#e8e0d8', nav:'#ffffff',
  text:'#2d2520', muted:'#8c7b72', subtle:'#c4b5ab',
  accent:'#d97706', accentBg:'#fef3c7',
  green:'#16a34a', greenBg:'#dcfce7',
  red:'#dc2626', redBg:'#fee2e2',
  blue:'#2563eb', blueBg:'#dbeafe',
  whatsapp:'#25d366',
};

const PALETTE = ['#d97706','#059669','#7c3aed','#db2777','#0284c7','#dc2626','#65a30d','#9333ea','#0891b2','#b45309'];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}
function initials(name) { return name.slice(0, 2).toUpperCase(); }
let nextId = 100;
const uid = () => String(++nextId);

function Avatar({ name, size = 36, ring = false }) {
  const color = avatarColor(name);
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:size*0.32, flexShrink:0, boxShadow:ring?`0 0 0 3px ${color}40`:'none' }}>
      {initials(name)}
    </div>
  );
}

function WinBar({ wins, played }) {
  const pct = played > 0 ? Math.round((wins / played) * 100) : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, width:'100%' }}>
      <div style={{ flex:1, height:5, background:C.border, borderRadius:99, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${C.accent},#f59e0b)`, borderRadius:99 }}/>
      </div>
      <span style={{ fontSize:11, fontWeight:800, color:C.muted, width:32, textAlign:'right' }}>{pct}%</span>
    </div>
  );
}

function MatchCard({ m, isAdmin, onDelete }) {
  const t1Won = m.winner === 1;
  const sets = [];
  for (let i = 0; i < 3; i++) {
    const a = m.scores[i*2], b = m.scores[i*2+1];
    if (a !== undefined && a !== '' && b !== undefined && b !== '') sets.push({ t1:Number(a), t2:Number(b) });
  }
  const formatDate = (d) => {
    if (!d) return '';
    const [,mo,day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(day)} ${months[parseInt(mo)-1]}`;
  };
  const rows = [
    { players:[m.p1,m.p2], won:t1Won,  scores:sets.map(s=>s.t1), opp:sets.map(s=>s.t2) },
    { players:[m.p3,m.p4], won:!t1Won, scores:sets.map(s=>s.t2), opp:sets.map(s=>s.t1) },
  ];
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ padding:'9px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', background:'#faf8f6' }}>
        <span style={{ fontSize:12, fontWeight:700, color:C.muted }}>{formatDate(m.date)}</span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, fontWeight:600, color:C.subtle }}>Week {m.week}</span>
          {isAdmin && <button onClick={onDelete} style={{ background:'none', border:'none', color:C.subtle, cursor:'pointer', padding:2, display:'flex' }}><TrashIcon size={13}/></button>}
        </div>
      </div>
      {rows.map((row,ri) => (
        <div key={ri} style={{ display:'flex', alignItems:'center', padding:'13px 16px', borderBottom:ri===0?`1px solid ${C.border}`:'none', background:row.won?'#f6fef9':C.surface }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
            <div style={{ display:'flex' }}>
              {row.players.map((name,ni) => (
                <div key={name} style={{ marginLeft:ni>0?-10:0, zIndex:ni }}><Avatar name={name} size={36}/></div>
              ))}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:800, color:row.won?C.text:C.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {row.players[0]} & {row.players[1]}
              </div>
              {row.won && <div style={{ fontSize:10, fontWeight:700, color:C.green, marginTop:1 }}>Winner 🏆</div>}
            </div>
          </div>
          <div style={{ display:'flex', gap:14, alignItems:'center', flexShrink:0, marginLeft:10 }}>
            {row.scores.map((score,si) => (
              <span key={si} style={{ fontSize:28, fontWeight:900, lineHeight:1, color:score>row.opp[si]?C.text:'#c4b5ab', minWidth:20, textAlign:'center' }}>{score}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const EmptyState = ({ icon, title, sub }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 20px', textAlign:'center' }}>
    <div style={{ width:72, height:72, borderRadius:20, background:'#fff', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:16 }}>{icon}</div>
    <p style={{ fontSize:15, fontWeight:900, color:C.text, marginBottom:6 }}>{title}</p>
    <p style={{ fontSize:12, fontWeight:600, color:C.subtle }}>{sub}</p>
  </div>
);

export default function App() {
  const [matches, setMatches] = useState([
    { id:'m1', week:1, date:"2026-05-26", p1:"Michael", p2:"Byron",   p3:"Keagan",  p4:"Nathan",  scores:[3,6,6,7,5,7], winner:1 },
    { id:'m2', week:1, date:"2026-05-26", p1:"John",    p2:"Brandon", p3:"Connor",  p4:"Graeme",  scores:[3,6,3,6,7,5], winner:1 },
    { id:'m3', week:2, date:"", p1:"Graeme",  p2:"Michael", p3:"Keagan",  p4:"Byron",   scores:[6,7,6,2,7,6], winner:1 },
    { id:'m4', week:2, date:"",           p1:"Brandon", p2:"Connor",  p3:"Darren",  p4:"John",    scores:[6,1,6,3,6,2], winner:1 },
    { id:'m5', week:3, date:"2026-06-09", p1:"Graeme",  p2:"Michael", p3:"Keagan",  p4:"John",    scores:[6,4,6,7,6,4], winner:1 },
    { id:'m6', week:3, date:"2026-06-09", p1:"Connor",  p2:"Byron",   p3:"Darren",  p4:"Nathan",  scores:[6,3,3,6,6,1], winner:1 },
    { id:'m7', week:4, date:"2026-06-16", p1:"Keagan",  p2:"Connor",  p3:"Graeme",  p4:"John",    scores:[6,0,6,4,6,1], winner:1 },
    { id:'m8', week:4, date:"2026-06-16", p1:"Byron",   p2:"Nathan",  p3:"Michael", p4:"Darren",  scores:[6,7,6,1,6,3], winner:1 },
    { id:'m9', week:5, date:"2026-06-23", p1:"Keagan",  p2:"Brandon", p3:"Graeme",  p4:"Michael", scores:[6,2,6,4,2,6], winner:1 },
    { id:'m10',week:5, date:"2026-06-23", p1:"Connor",  p2:"Nathan",  p3:"Byron",   p4:"Darren",  scores:[7,5,6,2,6,1], winner:1 },
  ]);
  const [upcoming, setUpcoming] = useState([
    { id:'u1', week:2, date:"", time:"", p1:"Brandon", p2:"Connor",  p3:"John",    p4:"Darren"  },
    { id:'u2', week:2, date:"", time:"", p1:"Graeme",  p2:"Byron",   p3:"Keagan",  p4:"Michael" },
    { id:'u3', week:2, date:"", time:"", p1:"John",    p2:"Michael", p3:"Graeme",  p4:"Keagan"  },
    { id:'u4', week:3, date:"", time:"", p1:"Brandon", p2:"Darren",  p3:"Connor",  p4:"Byron"   },
    { id:'u5', week:3, date:"", time:"", p1:"John",    p2:"Graeme",  p3:"Connor",  p4:"John"    },
    { id:'u6', week:4, date:"", time:"", p1:"Brandon", p2:"Byron",   p3:"Darren",  p4:"Michael" },
    { id:'u7', week:4, date:"", time:"", p1:"Connor",  p2:"John",    p3:"Darren",  p4:"Connor"  },
    { id:'u8', week:5, date:"", time:"", p1:"Brandon", p2:"Michael", p3:"Byron",   p4:"Keagan"  },
    { id:'u9', week:5, date:"", time:"", p1:"Darren",  p2:"Connor",  p3:"Byron",   p4:"Darren"  },
    { id:'u10',week:6, date:"", time:"", p1:"Brandon", p2:"Keagan",  p3:"Michael", p4:"Graeme"  },
    { id:'u11',week:6, date:"", time:"", p1:"Byron",   p2:"Darren",  p3:"Keagan",  p4:"John"    },
    { id:'u12',week:7, date:"", time:"", p1:"Brandon", p2:"Graeme",  p3:"Keagan",  p4:"John"    },
  ]);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('standings');
  const [pinModal, setPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [toast, setToast] = useState('');

  // Result form
  const [showAddResult, setShowAddResult] = useState(false);
  const [mWeek, setMWeek] = useState('1');
  const [mDate, setMDate] = useState('');
  const [mp1,setMp1] = useState(''); const [mp2,setMp2] = useState('');
  const [mp3,setMp3] = useState(''); const [mp4,setMp4] = useState('');
  const [mScores, setMScores] = useState(['','','','','','']);
  const [mWinner, setMWinner] = useState(1);

  // Upcoming form
  const [showAddUpcoming, setShowAddUpcoming] = useState(false);
  const [uWeek,setUWeek] = useState('1');
  const [uDate,setUDate] = useState(''); const [uTime,setUTime] = useState('');
  const [up1,setUp1] = useState(''); const [up2,setUp2] = useState('');
  const [up3,setUp3] = useState(''); const [up4,setUp4] = useState('');
  const [newPlayer, setNewPlayer] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  const tryPin = (pin) => {
    if (pin === ADMIN_PIN) { setIsAdmin(true); setPinModal(false); setPinInput(''); setPinError(false); }
    else { setPinError(true); setPinInput(''); setTimeout(()=>setPinError(false),900); }
  };
  const handlePinKey = (k) => {
    if (k==='⌫') { setPinInput(p=>p.slice(0,-1)); return; }
    if (pinInput.length>=4) return;
    const next = pinInput+k;
    setPinInput(next);
    if (next.length===4) setTimeout(()=>tryPin(next),120);
  };

  const leaderboard = useMemo(() => {
    const stats = {};
    players.forEach(p => stats[p]={name:p,wins:0,losses:0,played:0,gw:0,gl:0});
    matches.forEach(m => {
      const t1W = m.winner===1;
      const t1g = (Number(m.scores[0])||0)+(Number(m.scores[2])||0)+(Number(m.scores[4])||0);
      const t2g = (Number(m.scores[1])||0)+(Number(m.scores[3])||0)+(Number(m.scores[5])||0);
      [m.p1,m.p2].forEach(p=>{if(!stats[p])return;stats[p].played++;stats[p].gw+=t1g;stats[p].gl+=t2g;if(t1W)stats[p].wins++;else stats[p].losses++;});
      [m.p3,m.p4].forEach(p=>{if(!stats[p])return;stats[p].played++;stats[p].gw+=t2g;stats[p].gl+=t1g;if(!t1W)stats[p].wins++;else stats[p].losses++;});
    });
    return Object.values(stats)
      .sort((a,b)=>b.wins-a.wins||(b.gw-b.gl)-(a.gw-a.gl))
      .map((p,i,a)=>({...p,rank:i>0&&p.wins===a[i-1].wins?a[i-1].rank:i+1}));
  }, [matches,players]);

  const sortedMatches = useMemo(()=>[...matches].sort((a,b)=>b.week-a.week),[matches]);
  const weeks = useMemo(()=>[...new Set(sortedMatches.map(m=>m.week))].sort((a,b)=>b-a),[sortedMatches]);

  const handleShare = () => {
    let text = `🎾 PADEL LEAGUE 🎾\n\n`;
    if (sortedMatches.length>0) {
      text+=`📅 LATEST RESULTS\n`;
      sortedMatches.slice(0,4).forEach(m=>{
        const w=m.winner===1?[m.p1,m.p2]:[m.p3,m.p4], l=m.winner===1?[m.p3,m.p4]:[m.p1,m.p2];
        const wS=m.winner===1?[m.scores[0],m.scores[2],m.scores[4]]:[m.scores[1],m.scores[3],m.scores[5]];
        const lS=m.winner===1?[m.scores[1],m.scores[3],m.scores[5]]:[m.scores[0],m.scores[2],m.scores[4]];
        let sc=''; for(let i=0;i<3;i++) if(wS[i]!==''&&!isNaN(Number(wS[i]))) sc+=`${wS[i]}-${lS[i]} `;
        text+=`✅ ${w[0]} & ${w[1]} def. ${l[0]} & ${l[1]} (${sc.trim()})\n`;
      });
      text+=`\n`;
    }
    text+=`👑 STANDINGS\n`;
    leaderboard.forEach(p=>{text+=`${p.rank}. ${p.name} — ${p.wins}W ${p.losses}L\n`;});
    try { navigator.clipboard.writeText(text).then(()=>showToast('Copied to clipboard! 📋')); } catch(e) {
      const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
      try{document.execCommand('copy');showToast('Copied!');}catch{}
      document.body.removeChild(ta);
    }
    setTimeout(()=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'),300);
  };

  const saveMatch = () => {
    if (!mp1||!mp2||!mp3||!mp4||!mDate) return;
    setMatches(prev=>[...prev,{id:uid(),week:parseInt(mWeek)||1,date:mDate,p1:mp1,p2:mp2,p3:mp3,p4:mp4,scores:mScores.map(s=>parseInt(s)||0),winner:mWinner}]);
    setMp1('');setMp2('');setMp3('');setMp4('');setMScores(['','','','','','']);setMWinner(1);setShowAddResult(false);
    showToast('Match saved! ✅');
  };
  const saveUpcoming = () => {
    if (!up1||!up2||!up3||!up4||!uDate) return;
    setUpcoming(prev=>[...prev,{id:uid(),week:parseInt(uWeek)||1,date:uDate,time:uTime,p1:up1,p2:up2,p3:up3,p4:up4}]);
    setUp1('');setUp2('');setUp3('');setUp4('');setUTime('');setShowAddUpcoming(false);
    showToast('Match scheduled! 📅');
  };
  const addPlayer = () => {
    const name = newPlayer.trim();
    if (!name||players.includes(name)) return;
    setPlayers(prev=>[...prev,name].sort());
    setNewPlayer('');
    showToast(`${name} added! 👤`);
  };

  const inp = { width:'100%', padding:'10px 14px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontWeight:700, fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const lbl = { fontSize:9, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:4 };
  const card = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' };

  const TABS = [
    {id:'standings',label:'🏆 Standings'},
    {id:'weekly',   label:'📅 Results'},
    {id:'upcoming', label:'🗓 Upcoming'},
    {id:'players',  label:'👥 Players'},
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'DM Sans','system-ui',sans-serif", color:C.text, paddingBottom:80 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap'); *{box-sizing:border-box;} input[type=date],input[type=time],input[type=number]{color-scheme:light;}`}</style>

      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:C.text, color:'#fff', padding:'10px 22px', borderRadius:12, fontSize:13, fontWeight:700, zIndex:200, whiteSpace:'nowrap', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' }}>{toast}</div>
      )}

      {/* NAV */}
      <nav style={{ background:C.nav, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 16px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.accent},#f59e0b)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 3px 10px ${C.accent}35`, color:'#fff' }}>
              <TrophyIcon size={17}/>
            </div>
            <span style={{ fontWeight:900, fontSize:17, letterSpacing:'-0.03em' }}>Padel League</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={handleShare} style={{ padding:'7px 14px', borderRadius:10, border:'none', background:C.whatsapp, color:'#fff', cursor:'pointer', fontWeight:800, fontSize:12, display:'flex', alignItems:'center', gap:6, fontFamily:'inherit' }}>
              <ShareIcon size={14}/> Share
            </button>
            <button onClick={()=>isAdmin?setIsAdmin(false):setPinModal(true)} style={{ padding:'7px 12px', borderRadius:10, border:`1px solid ${isAdmin?'#bbf7d0':C.border}`, background:isAdmin?'#f0fdf4':C.surface, color:isAdmin?C.green:C.muted, cursor:'pointer', fontWeight:800, fontSize:12, display:'flex', alignItems:'center', gap:5, fontFamily:'inherit' }}>
              <ShieldIcon size={13}/> {isAdmin?'Admin ✓':'Admin'}
            </button>
          </div>
        </div>
      </nav>

      {/* PIN MODAL */}
      {pinModal && (
        <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(45,37,32,0.55)', backdropFilter:'blur(8px)' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:28, padding:32, width:290, boxShadow:'0 20px 60px rgba(0,0,0,0.12)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <span style={{ fontWeight:900, fontSize:16 }}>Admin PIN</span>
              <button onClick={()=>{setPinModal(false);setPinInput('');setPinError(false);}} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer' }}><XIcon size={18}/></button>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:24 }}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{ width:46, height:46, borderRadius:14, border:`2px solid ${pinInput.length>i?(pinError?C.red:C.accent):C.border}`, background:pinInput.length>i?(pinError?C.redBg:C.accentBg):C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:pinError?C.red:C.accent, fontWeight:900 }}>
                  {pinInput.length>i?'●':''}
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k,i)=>(
                k===''?<div key={i}/>:
                <button key={i} onClick={()=>handlePinKey(String(k))} style={{ height:50, borderRadius:14, border:`1px solid ${C.border}`, background:C.bg, color:C.text, fontWeight:900, fontSize:18, cursor:'pointer', fontFamily:'inherit' }}>{k}</button>
              ))}
            </div>
            {pinError&&<p style={{ textAlign:'center', color:C.red, fontSize:11, fontWeight:800, marginTop:12 }}>Incorrect PIN</p>}
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ maxWidth:900, margin:'16px auto 0', padding:'0 16px' }}>
        <div style={{ display:'flex', gap:4, background:C.surface, border:`1px solid ${C.border}`, padding:4, borderRadius:16 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setView(t.id)} style={{ flex:1, padding:'9px 4px', borderRadius:12, border:'none', cursor:'pointer', fontWeight:800, fontSize:11, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'inherit', background:view===t.id?C.text:'transparent', color:view===t.id?'#fff':C.muted }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth:900, margin:'0 auto', padding:'20px 16px' }}>

        {/* STANDINGS */}
        {view==='standings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {matches.length===0 ? (
              <EmptyState icon="🏆" title="Season hasn't started yet" sub="Standings will appear once matches are logged"/>
            ) : (
              <>
                {leaderboard[0] && leaderboard[0].wins > 0 && (
                  <div style={{ borderRadius:24, border:`1px solid ${C.accent}30`, padding:24, background:'linear-gradient(135deg,#fffbf0,#fef3c7 50%,#fffbf0)', boxShadow:`0 2px 16px ${C.accent}12` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                      <Avatar name={leaderboard[0].name} size={64} ring/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10, fontWeight:800, color:C.accent, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>League Leader</div>
                        <div style={{ fontSize:24, fontWeight:900, letterSpacing:'-0.03em', marginBottom:8 }}>{leaderboard[0].name}</div>
                        <WinBar wins={leaderboard[0].wins} played={leaderboard[0].played}/>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:44, fontWeight:900, color:C.accent, lineHeight:1 }}>{leaderboard[0].wins}</div>
                        <div style={{ fontSize:10, fontWeight:800, color:'#a16207', textTransform:'uppercase' }}>Wins</div>
                      </div>
                    </div>
                  </div>
                )}
                <div style={card}>
                  <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em' }}>Full Standings</span>
                    <span style={{ fontSize:11, color:C.subtle }}>{leaderboard.length} players</span>
                  </div>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                        {['#','Player','P','W','L'].map(h=>(
                          <th key={h} style={{ padding:'10px 12px', fontSize:9, fontWeight:800, color:C.subtle, textTransform:'uppercase', letterSpacing:'0.1em', textAlign:h==='Player'?'left':'center' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((p,i)=>(
                        <tr key={p.name} style={{ borderBottom:`1px solid ${C.border}`, background:i===0&&p.wins>0?C.accentBg:'transparent' }}>
                          <td style={{ padding:'12px', textAlign:'center', fontSize:16 }}>
                            {p.wins>0&&p.rank===1?'🥇':p.wins>0&&p.rank===2?'🥈':p.wins>0&&p.rank===3?'🥉':<span style={{fontSize:12,fontWeight:800,color:C.muted}}>{p.rank}</span>}
                          </td>
                          <td style={{ padding:'12px 8px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <Avatar name={p.name} size={32}/>
                              <span style={{ fontWeight:800, fontSize:14 }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign:'center', fontSize:13, fontWeight:700, color:C.muted }}>{p.played}</td>
                          <td style={{ textAlign:'center', fontSize:14, fontWeight:900, color:C.green }}>{p.wins}</td>
                          <td style={{ textAlign:'center', fontSize:14, fontWeight:900, color:C.red }}>{p.losses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* RESULTS */}
        {view==='weekly' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {isAdmin && (
              <div style={{ ...card, border:`1px solid #bfdbfe`, overflow:'hidden' }}>
                <button onClick={()=>setShowAddResult(!showAddResult)} style={{ width:'100%', padding:'14px 20px', background:C.blue, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'inherit' }}>
                  <span style={{ fontWeight:900, fontSize:11, color:'#fff', textTransform:'uppercase', letterSpacing:'0.08em' }}>{showAddResult?'Close':'+ Log New Result'}</span>
                  <PlusIcon size={15}/>
                </button>
                {showAddResult && (
                  <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div><label style={lbl}>Week</label><input type="number" value={mWeek} onChange={e=>setMWeek(e.target.value)} style={inp}/></div>
                      <div><label style={lbl}>Date</label><input type="date" value={mDate} onChange={e=>setMDate(e.target.value)} style={inp}/></div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                      {[{label:'Team 1',color:C.blue,ps:[{v:mp1,s:setMp1,ex:[mp2,mp3,mp4]},{v:mp2,s:setMp2,ex:[mp1,mp3,mp4]}]},
                        {label:'Team 2',color:C.red,ps:[{v:mp3,s:setMp3,ex:[mp1,mp2,mp4]},{v:mp4,s:setMp4,ex:[mp1,mp2,mp3]}]}
                      ].map((team,ti)=>(
                        <div key={ti} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          <label style={{ ...lbl, color:team.color }}>{team.label}</label>
                          {team.ps.map((sel,i)=>(
                            <select key={i} value={sel.v} onChange={e=>sel.s(e.target.value)} style={{ ...inp, appearance:'none' }}>
                              <option value="">Pick player…</option>
                              {players.filter(p=>!sel.ex.includes(p)).map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:10 }}>
                      {[1,2].map(t=>(
                        <div key={t} onClick={()=>setMWinner(t)} style={{ flex:1, padding:11, borderRadius:12, border:`2px solid ${mWinner===t?(t===1?C.blue:C.red):C.border}`, background:mWinner===t?(t===1?C.blueBg:C.redBg):'transparent', color:mWinner===t?(t===1?C.blue:C.red):C.muted, fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                          🏆 Team {t} Won
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={lbl}>Set Scores</label>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                        {[0,1,2].map(idx=>(
                          <div key={idx} style={{ background:C.bg, borderRadius:12, padding:'10px 8px', border:`1px solid ${C.border}` }}>
                            <div style={{ ...lbl, textAlign:'center', marginBottom:6 }}>Set {idx+1}</div>
                            <div style={{ display:'flex', gap:4 }}>
                              {[0,1].map(ti=>(
                                <input key={ti} type="number" min="0" placeholder={`T${ti+1}`}
                                  value={mScores[idx*2+ti]} onChange={e=>{const ns=[...mScores];ns[idx*2+ti]=e.target.value;setMScores(ns);}}
                                  style={{ ...inp, textAlign:'center', padding:'8px 4px' }}/>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={saveMatch} style={{ padding:12, background:C.blue, border:'none', borderRadius:14, color:'#fff', fontWeight:900, fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', fontFamily:'inherit' }}>
                      💾 Save Match
                    </button>
                  </div>
                )}
              </div>
            )}
            {weeks.length===0 ? (
              <EmptyState icon="📅" title="No results yet" sub={isAdmin?'Use the button above to log the first match':'Check back after the first week of play'}/>
            ) : (
              weeks.map(week=>(
                <div key={week}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, margin:'4px 0 12px' }}>
                    <div style={{ flex:1, height:1, background:C.border }}/>
                    <span style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 4px' }}>Week {week}</span>
                    <div style={{ flex:1, height:1, background:C.border }}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12 }}>
                    {sortedMatches.filter(m=>m.week===week).map(m=>(
                      <MatchCard key={m.id} m={m} isAdmin={isAdmin} onDelete={()=>setMatches(prev=>prev.filter(x=>x.id!==m.id))}/>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* UPCOMING */}
        {view==='upcoming' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {isAdmin && (
              <div style={{ ...card, border:`1px solid #fed7aa`, overflow:'hidden' }}>
                <button onClick={()=>setShowAddUpcoming(!showAddUpcoming)} style={{ width:'100%', padding:'14px 20px', background:'#ea580c', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'inherit' }}>
                  <span style={{ fontWeight:900, fontSize:11, color:'#fff', textTransform:'uppercase', letterSpacing:'0.08em' }}>{showAddUpcoming?'Close':'+ Schedule Match'}</span>
                  <PlusIcon size={15}/>
                </button>
                {showAddUpcoming && (
                  <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                      {[{l:'Week',t:'number',v:uWeek,s:setUWeek},{l:'Date',t:'date',v:uDate,s:setUDate},{l:'Time',t:'time',v:uTime,s:setUTime}].map(f=>(
                        <div key={f.l}><label style={lbl}>{f.l}</label><input type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} style={inp}/></div>
                      ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                      {[{l:'Team 1',c:C.blue,ps:[{v:up1,s:setUp1,ex:[up2,up3,up4]},{v:up2,s:setUp2,ex:[up1,up3,up4]}]},
                        {l:'Team 2',c:C.red,ps:[{v:up3,s:setUp3,ex:[up1,up2,up4]},{v:up4,s:setUp4,ex:[up1,up2,up3]}]}
                      ].map((team,ti)=>(
                        <div key={ti} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          <label style={{ ...lbl, color:team.c }}>{team.l}</label>
                          {team.ps.map((sel,i)=>(
                            <select key={i} value={sel.v} onChange={e=>sel.s(e.target.value)} style={{ ...inp, appearance:'none' }}>
                              <option value="">Pick player…</option>
                              {players.filter(p=>!sel.ex.includes(p)).map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                          ))}
                        </div>
                      ))}
                    </div>
                    <button onClick={saveUpcoming} style={{ padding:12, background:'#ea580c', border:'none', borderRadius:14, color:'#fff', fontWeight:900, fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', fontFamily:'inherit' }}>
                      📅 Schedule
                    </button>
                  </div>
                )}
              </div>
            )}
            {upcoming.length===0 ? (
              <EmptyState icon="🗓" title="No matches scheduled" sub={isAdmin?'Use the button above to schedule a match':'Check back soon for upcoming fixtures'}/>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                {upcoming.map(m=>(
                  <div key={m.id} style={{ ...card, overflow:'hidden' }}>
                    <div style={{ height:3, background:'linear-gradient(90deg,#f97316,#fbbf24)' }}/>
                    <div style={{ padding:18 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:2 }}>📅 {m.date}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:C.muted }}>🕐 {m.time} · Week {m.week}</div>
                        </div>
                        {isAdmin && <button onClick={()=>setUpcoming(prev=>prev.filter(x=>x.id!==m.id))} style={{ background:'none', border:'none', color:C.subtle, cursor:'pointer' }}><TrashIcon size={13}/></button>}
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {[[m.p1,m.p2],[m.p3,m.p4]].map((team,ti)=>(
                          <div key={ti} style={{ flex:1, background:C.bg, borderRadius:12, padding:12, display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
                            {team.map(name=>(
                              <div key={name} style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <Avatar name={name} size={24}/><span style={{ fontSize:12, fontWeight:800 }}>{name}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PLAYERS */}
        {view==='players' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {isAdmin && (
              <div style={{ display:'flex', gap:10 }}>
                <input type="text" placeholder="New player name…" value={newPlayer} onChange={e=>setNewPlayer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} style={{ ...inp, flex:1 }}/>
                <button onClick={addPlayer} style={{ padding:'10px 18px', background:C.green, border:'none', borderRadius:12, color:'#fff', fontWeight:900, fontSize:12, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>+ Add</button>
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
              {players.map(p=>{
                const stats = leaderboard.find(l=>l.name===p);
                return (
                  <div key={p} style={{ ...card, padding:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                      <Avatar name={p} size={40}/>
                      <div>
                        <div style={{ fontWeight:900, fontSize:14 }}>{p}</div>
                        {stats&&<div style={{ fontSize:10, fontWeight:700, color:C.subtle }}>{stats.played} matches</div>}
                      </div>
                    </div>
                    {stats && (
                      <div style={{ display:'flex', gap:6 }}>
                        <div style={{ flex:1, background:C.greenBg, borderRadius:10, padding:'8px 4px', textAlign:'center' }}>
                          <div style={{ fontSize:16, fontWeight:900, color:C.green }}>{stats.wins}</div>
                          <div style={{ fontSize:9, fontWeight:800, color:'#86efac', textTransform:'uppercase' }}>W</div>
                        </div>
                        <div style={{ flex:1, background:C.redBg, borderRadius:10, padding:'8px 4px', textAlign:'center' }}>
                          <div style={{ fontSize:16, fontWeight:900, color:C.red }}>{stats.losses}</div>
                          <div style={{ fontSize:9, fontWeight:800, color:'#fca5a5', textTransform:'uppercase' }}>L</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
