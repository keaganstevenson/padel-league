import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA4sJvUkofJt1u61MEC-4JSkUKSN9pBEI8",
  authDomain: "dpl-padel-site.firebaseapp.com",
  databaseURL: "https://dpl-padel-site-default-rtdb.firebaseio.com",
  projectId: "dpl-padel-site",
  storageBucket: "dpl-padel-site.firebasestorage.app",
  messagingSenderId: "884760946899",
  appId: "1:884760946899:web:73035c5289adba435ecc26",
  measurementId: "G-P77FWBV1F8"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const ADMIN_PIN = "1234";
const LOGO_SQUARE_URL = "https://i.imgur.com/p6qJIP1.jpeg";
const LOGO_BANNER_URL = "https://i.imgur.com/dUkcrm5.jpeg";
const TODAY = new Date("2026-10-20");

const PLAYER_COLORS = {
  Brandon:"#00d4ff", Byron:"#ffd700", Connor:"#ff5252", Darren:"#00e676",
  Graeme:"#ff9800", John:"#e040fb", Keagan:"#00bcd4", Michael:"#f44336",
  Glenn:"#8bc34a", Nathan:"#a78bfa"
};

const S4_PLAYERS = ["Brandon","Byron","Connor","Darren","Graeme","John","Keagan","Michael","Glenn","Nathan"];

const S4_SCHEDULE_BASE = [
  { week:1, date:"08 Sep 2026", matches:[
    { p1:"Brandon", p2:"Byron",   p3:"Graeme",  p4:"Darren",  scores:["6-4","6-1","6-3"], result:[3,0] },
    { p1:"Keagan",  p2:"Michael", p3:"Connor",  p4:"John",    scores:["6-3","7-6","6-3"], result:[3,0] },
  ]},
  { week:2, date:"15 Sep 2026", matches:[
    { p1:"Connor",  p2:"Keagan",  p3:"Michael", p4:"Byron",   scores:["6-4","3-6","6-2"], result:[2,1] },
    { p1:"Darren",  p2:"Brandon", p3:"Graeme",  p4:"John",    scores:["6-1","6-2","6-4"], result:[3,0] },
  ]},
  { week:3, date:"22 Sep 2026", matches:[
    { p1:"Michael", p2:"Keagan",  p3:"Glenn",   p4:"Nathan",  scores:["6-3","6-2","1-6"], result:[2,1] },
    { p1:"Darren",  p2:"Brandon", p3:"John",    p4:"Byron",   scores:["6-3","6-3","7-6"], result:[3,0] },
  ]},
  { week:4, date:"29 Sep 2026", matches:[
    { p1:"Byron",   p2:"Graeme",  p3:"Darren",  p4:"Keagan",  scores:["7-5","6-7","6-4"], result:[2,1] },
    { p1:"Michael", p2:"Connor",  p3:"Brandon", p4:"John",    scores:["6-4","7-6","6-4"], result:[3,0] },
  ]},
  { week:5, date:"06 Oct 2026", matches:[
    { p1:"Darren",  p2:"Byron",   p3:"John",    p4:"Keagan",  scores:["7-5","6-3","2-6"], result:[2,1] },
    { p1:"Brandon", p2:"Connor",  p3:"Michael", p4:"Graeme",  scores:["6-4","7-6","2-6"], result:[2,1] },
  ]},
  { week:6, date:"13 Oct 2026", matches:[
    { p1:"John",    p2:"Byron",   p3:"Connor",  p4:"Graeme",  scores:["3-6","6-1","6-2"], result:[2,1] },
    { p1:"Michael", p2:"Nathan",  p3:"Brandon", p4:"Keagan",  scores:["6-4","7-5","6-2"], result:[3,0] },
  ]},
  { week:7, date:"20 Oct 2026", matches:[
    { p1:"Graeme",  p2:"Keagan",  p3:"Darren",  p4:"John",    scores:null, result:null },
    { p1:"Byron",   p2:"Connor",  p3:"Brandon", p4:"Michael", scores:null, result:null },
  ]},
];

const TEAMS = [
  { id:"t1", name:"Overhead Casualties", color:"#00d4ff", p1:"Brandon", p2:"Graeme",  emoji:"💥" },
  { id:"t2", name:"Circumserve",         color:"#ffd700", p1:"Byron",   p2:"Keagan",  emoji:"🌀" },
  { id:"t3", name:"One Nice Guy",        color:"#00e676", p1:"John",    p2:"Michael", emoji:"😇" },
  { id:"t4", name:"EFF",                 color:"#ff5252", p1:"Darren",  p2:"Connor",  emoji:"🔥" },
  { id:"t5", name:"The Benchwarmers",    color:"#a78bfa", p1:"Nathan",  p2:"Brett",   emoji:"🪑" },
];

const S3_SCHEDULE = [
  { round:1, matches:[{t1:"t1",t2:"t2",score1:null,score2:null},{t1:"t3",t2:"t4",score1:null,score2:null}]},
  { round:2, matches:[{t1:"t1",t2:"t3",score1:null,score2:null},{t1:"t2",t2:"t5",score1:null,score2:null}]},
  { round:3, matches:[{t1:"t2",t2:"t3",score1:null,score2:null},{t1:"t4",t2:"t5",score1:null,score2:null}]},
  { round:4, matches:[{t1:"t1",t2:"t4",score1:null,score2:null},{t1:"t3",t2:"t5",score1:null,score2:null}]},
  { round:5, matches:[{t1:"t1",t2:"t5",score1:null,score2:null},{t1:"t2",t2:"t4",score1:null,score2:null}]},
  { round:6, matches:[
    {t1:"t1",t2:"t2",score1:3,score2:1,sets:[{s1:6,s2:4},{s1:3,s2:6},{s1:6,s2:3},{s1:7,s2:6}]},
    {t1:"t3",t2:"t4",score1:3,score2:0,sets:[{s1:6,s2:2},{s1:6,s2:4},{s1:6,s2:3}]},
  ]},
  { round:7, matches:[
    {t1:"t2",t2:"t3",score1:3,score2:1,sets:[{s1:4,s2:6},{s1:6,s2:3},{s1:6,s2:2},{s1:6,s2:4}]},
    {t1:"t1",t2:"t4",score1:3,score2:0,sets:[{s1:6,s2:1},{s1:6,s2:3},{s1:6,s2:4}]},
  ]},
  { round:8, matches:[
    {t1:"t1",t2:"t3",score1:2,score2:3,sets:[{s1:3,s2:6},{s1:7,s2:6},{s1:4,s2:6},{s1:6,s2:3},{s1:3,s2:6}]},
    {t1:"t2",t2:"t5",score1:3,score2:0,sets:[{s1:6,s2:0},{s1:6,s2:1},{s1:6,s2:2}]},
  ]},
  { round:9, matches:[
    {t1:"t1",t2:"t5",score1:3,score2:0,sets:[{s1:6,s2:1},{s1:6,s2:2},{s1:6,s2:0}]},
    {t1:"t4",t2:"t3",score1:1,score2:3,sets:[{s1:3,s2:6},{s1:6,s2:3},{s1:2,s2:6},{s1:3,s2:6}]},
  ]},
  { round:10, matches:[
    {t1:"t2",t2:"t4",score1:3,score2:0,sets:[{s1:6,s2:2},{s1:6,s2:3},{s1:6,s2:1}]},
    {t1:"t3",t2:"t5",score1:3,score2:0,sets:[{s1:6,s2:1},{s1:6,s2:2},{s1:6,s2:0}]},
  ]},
];

const S3_SEMIS = [
  { match:"SF1", t1:"t2", t2:"t1", score1:3, score2:1, sets:[{s1:6,s2:3},{s1:4,s2:6},{s1:6,s2:4},{s1:6,s2:3}] },
  { match:"SF2", t1:"t3", t2:"t4", score1:3, score2:0, sets:[{s1:6,s2:2},{s1:6,s2:3},{s1:6,s2:4}] },
];

const S3_FINAL = { match:"F", t1:"t2", t2:"t3", score1:3, score2:1, sets:[{s1:6,s2:3},{s1:4,s2:6},{s1:6,s2:4},{s1:6,s2:2}] };

function calcS4Stats(schedule) {
  const stats = {};
  S4_PLAYERS.forEach(p => stats[p] = {name:p, played:0, wins:0, losses:0, pts:0, setsW:0, setsL:0});
  schedule.forEach(week => {
    week.matches.forEach(m => {
      if (!m.scores || !m.result) return;
      const [ws, ls] = m.result;
      const t1Won = ws > ls;
      const t1Pts = ws===3&&ls===0 ? 3 : ws>ls ? 2 : ls>ws&&ws===1 ? 1 : 0;
      const t2Pts = ls===3&&ws===0 ? 3 : ls>ws ? 2 : ws>ls&&ls===1 ? 1 : 0;
      [m.p1, m.p2].forEach(p => {
        if (!stats[p]) return;
        stats[p].played++; stats[p].setsW += ws; stats[p].setsL += ls;
        if (t1Won) { stats[p].wins++; stats[p].pts += t1Pts; }
        else { stats[p].losses++; stats[p].pts += t1Pts; }
      });
      [m.p3, m.p4].forEach(p => {
        if (!stats[p]) return;
        stats[p].played++; stats[p].setsW += ls; stats[p].setsL += ws;
        if (!t1Won) { stats[p].wins++; stats[p].pts += t2Pts; }
        else { stats[p].losses++; stats[p].pts += t2Pts; }
      });
    });
  });
  return Object.values(stats).filter(p => p.played > 0)
    .sort((a,b) => b.pts-a.pts || (b.wins-a.wins) || (b.setsW-b.setsL)-(a.setsW-a.setsL));
}

function calcTeamStandings() {
  const standings = {};
  TEAMS.forEach(t => standings[t.id] = {id:t.id, name:t.name, color:t.color, emoji:t.emoji, p:0, w:0, l:0, pts:0, gamesW:0, gamesL:0});
  S3_SCHEDULE.forEach(round => {
    round.matches.forEach(m => {
      if (m.score1 === null) return;
      standings[m.t1].p++; standings[m.t2].p++;
      standings[m.t1].gamesW += m.score1; standings[m.t1].gamesL += m.score2;
      standings[m.t2].gamesW += m.score2; standings[m.t2].gamesL += m.score1;
      if (m.score1 > m.score2) {
        standings[m.t1].w++; standings[m.t1].pts += 2;
        standings[m.t2].l++;
      } else {
        standings[m.t2].w++; standings[m.t2].pts += 2;
        standings[m.t1].l++;
      }
    });
  });
  return Object.values(standings).sort((a,b) => b.pts-a.pts || (b.gamesW-b.gamesL)-(a.gamesW-a.gamesL));
}

function calcHistStats(liveSchedule) {
  const stats = {};
  const addPlayer = p => { if (!stats[p]) stats[p] = {name:p, played:0, wins:0, losses:0, setsW:0, setsL:0}; };
  liveSchedule.forEach(week => {
    week.matches.forEach(m => {
      if (!m.scores || !m.result) return;
      const [ws, ls] = m.result;
      [m.p1,m.p2].forEach(p => {
        addPlayer(p); stats[p].played++; stats[p].setsW+=ws; stats[p].setsL+=ls;
        if (ws>ls) stats[p].wins++; else stats[p].losses++;
      });
      [m.p3,m.p4].forEach(p => {
        addPlayer(p); stats[p].played++; stats[p].setsW+=ls; stats[p].setsL+=ws;
        if (ls>ws) stats[p].wins++; else stats[p].losses++;
      });
    });
  });
  S3_SCHEDULE.forEach(round => {
    round.matches.forEach(m => {
      if (m.score1 === null) return;
      const t1 = TEAMS.find(t=>t.id===m.t1); const t2 = TEAMS.find(t=>t.id===m.t2);
      if (!t1||!t2) return;
      [t1.p1,t1.p2].forEach(p => {
        addPlayer(p); stats[p].played++;
        if (m.score1>m.score2) stats[p].wins++; else stats[p].losses++;
      });
      [t2.p1,t2.p2].forEach(p => {
        addPlayer(p); stats[p].played++;
        if (m.score2>m.score1) stats[p].wins++; else stats[p].losses++;
      });
    });
  });
  [...S3_SEMIS, S3_FINAL].forEach(m => {
    const t1=TEAMS.find(t=>t.id===m.t1); const t2=TEAMS.find(t=>t.id===m.t2);
    if(!t1||!t2) return;
    [t1.p1,t1.p2].forEach(p=>{addPlayer(p);stats[p].played++;if(m.score1>m.score2)stats[p].wins++;else stats[p].losses++;});
    [t2.p1,t2.p2].forEach(p=>{addPlayer(p);stats[p].played++;if(m.score2>m.score1)stats[p].wins++;else stats[p].losses++;});
  });
  return Object.values(stats).sort((a,b)=>b.wins-a.wins||b.played-a.played);
}

function Avatar({name, size=32}) {
  const color = PLAYER_COLORS[name] || "#888";
  const initials = name.slice(0,2).toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", background:color+"33",
      border:`2px solid ${color}`, display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:size*0.35, fontWeight:700,
      color:color, flexShrink:0, letterSpacing:"-0.5px"
    }}>{initials}</div>
  );
}

function ScoreEntry({ liveSchedule }) {
  const [pinInput, setPinInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [season, setSeason] = useState("s4");
  const [week, setWeek] = useState("1");
  const [matchIdx, setMatchIdx] = useState("0");
  const [sets, setSets] = useState([{a:"",b:""},{a:"",b:""},{a:"",b:""}]);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handlePin = () => {
    if (pinInput === ADMIN_PIN) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPinInput(""); }
  };

  const weekMatches = useMemo(() => {
    const w = liveSchedule.find(w => w.week === parseInt(week));
    return w ? w.matches : [];
  }, [week, liveSchedule]);

  const selectedMatch = weekMatches[parseInt(matchIdx)];

  const updateSet = (i, side, val) => {
    const next = sets.map((s,idx) => idx===i ? {...s,[side]:val} : s);
    setSets(next);
  };

  const handleSubmit = async () => {
    if (!selectedMatch) return;
    const parsedSets = sets.map(s => ({a:parseInt(s.a)||0, b:parseInt(s.b)||0}));
    const validSets = parsedSets.filter(s => s.a>0||s.b>0);
    if (validSets.length < 2) { setStatus({type:"error",msg:"Enter at least 2 sets."}); return; }

    let t1Sets=0, t2Sets=0;
    const scoreStrings = [];
    validSets.forEach(s => {
      if (s.a > s.b) t1Sets++; else t2Sets++;
      scoreStrings.push(`${s.a}-${s.b}`);
    });

    const result = [t1Sets, t2Sets];
    const key = `w${week}m${matchIdx}`;

    setSaving(true);
    try {
      await set(ref(db, `scores/s4/${key}`), { scores: scoreStrings, result });
      setStatus({type:"success", msg:"✅ Score saved! Standings updated."});
      setSets([{a:"",b:""},{a:"",b:""},{a:"",b:""}]);
      setMatchIdx("0");
    } catch(e) {
      setStatus({type:"error", msg:"❌ Failed to save. Check connection."});
    }
    setSaving(false);
    setTimeout(()=>setStatus(null), 4000);
  };

  const s = {
    card: { background:"#12121a", borderRadius:16, padding:24, border:"1px solid #1e1e2e" },
    label: { color:"#888", fontSize:13, marginBottom:6, display:"block" },
    select: { width:"100%", background:"#1a1a2e", color:"#e0e0e0", border:"1px solid #2a2a3e",
      borderRadius:8, padding:"10px 12px", fontSize:15, outline:"none", marginBottom:16 },
    input: { background:"#1a1a2e", color:"#e0e0e0", border:"1px solid #2a2a3e",
      borderRadius:8, padding:"10px 0", fontSize:18, fontWeight:700, outline:"none",
      textAlign:"center", width:"64px" },
    btn: { background:"#00d4ff", color:"#0a0a0f", border:"none", borderRadius:10,
      padding:"12px 28px", fontSize:16, fontWeight:700, cursor:"pointer", width:"100%" },
    pinInput: { background:"#1a1a2e", color:"#e0e0e0", border:"1px solid #2a2a3e",
      borderRadius:8, padding:"12px 16px", fontSize:20, fontWeight:700, outline:"none",
      textAlign:"center", width:"160px", letterSpacing:8 },
  };

  if (!unlocked) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:60,gap:24}}>
        <div style={{fontSize:48}}>🔐</div>
        <div style={{color:"#e0e0e0",fontSize:20,fontWeight:700}}>Score Entry</div>
        <div style={{color:"#888",fontSize:14}}>Enter admin PIN to continue</div>
        <input
          type="password" value={pinInput} maxLength={4}
          onChange={e=>setPinInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handlePin()}
          style={s.pinInput} placeholder="••••"
        />
        {pinError && <div style={{color:"#ff5252",fontSize:14}}>Incorrect PIN. Try again.</div>}
        <button onClick={handlePin} style={{...s.btn,width:180}}>Unlock</button>
      </div>
    );
  }

  return (
    <div style={{maxWidth:520,margin:"0 auto",padding:"0 16px 40px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <div style={{fontSize:28}}>📝</div>
        <div>
          <div style={{color:"#e0e0e0",fontSize:20,fontWeight:700}}>Score Entry</div>
          <div style={{color:"#888",fontSize:13}}>Enter match results</div>
        </div>
      </div>

      <div style={s.card}>
        <label style={s.label}>Season</label>
        <select value={season} onChange={e=>{setSeason(e.target.value);setWeek("1");setMatchIdx("0");}} style={s.select}>
          <option value="s4">Season 4 — Padelmaxxing</option>
          <option value="s3">Season 3 — DPL Team League</option>
        </select>

        {season === "s3" ? (
          <div style={{background:"#1a1a2e",borderRadius:10,padding:20,textAlign:"center",color:"#888"}}>
            🔒 Season 3 scores are locked and cannot be edited.
          </div>
        ) : (
          <>
            <label style={s.label}>Week</label>
            <select value={week} onChange={e=>{setWeek(e.target.value);setMatchIdx("0");}} style={s.select}>
              {liveSchedule.map(w => (
                <option key={w.week} value={String(w.week)}>Week {w.week} — {w.date}</option>
              ))}
            </select>

            <label style={s.label}>Match</label>
            <select value={matchIdx} onChange={e=>setMatchIdx(e.target.value)} style={s.select}>
              {weekMatches.map((m,i) => (
                <option key={i} value={String(i)}>
                  {m.p1} & {m.p2} vs {m.p3} & {m.p4}
                  {m.scores ? " ✓" : ""}
                </option>
              ))}
            </select>

            {selectedMatch && (
              <div style={{background:"#0a0a0f",borderRadius:10,padding:16,marginBottom:16}}>
                <div style={{color:"#888",fontSize:12,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Teams</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{color:"#00d4ff",fontWeight:700,fontSize:15}}>{selectedMatch.p1}</div>
                    <div style={{color:"#888",fontSize:12}}>& {selectedMatch.p2}</div>
                  </div>
                  <div style={{color:"#444",fontWeight:700,fontSize:18}}>VS</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{color:"#ff9800",fontWeight:700,fontSize:15}}>{selectedMatch.p3}</div>
                    <div style={{color:"#888",fontSize:12}}>& {selectedMatch.p4}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{marginBottom:16}}>
              {["Set 1","Set 2","Set 3"].map((label,i) => (
                <div key={i} style={{marginBottom:12}}>
                  <div style={{color:"#888",fontSize:12,marginBottom:6}}>{label}{i===2?" (optional if 3-0)":""}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <input
                      type="number" min={0} max={99} value={sets[i].a}
                      onChange={e=>updateSet(i,"a",e.target.value)}
                      style={{...s.input,borderColor: sets[i].a?"#00d4ff":"#2a2a3e"}}
                      placeholder="0"
                    />
                    <div style={{color:"#444",fontWeight:700,fontSize:20,flex:1,textAlign:"center"}}>—</div>
                    <input
                      type="number" min={0} max={99} value={sets[i].b}
                      onChange={e=>updateSet(i,"b",e.target.value)}
                      style={{...s.input,borderColor: sets[i].b?"#ff9800":"#2a2a3e"}}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {status && (
              <div style={{
                padding:"12px 16px", borderRadius:8, marginBottom:16,
                background: status.type==="success" ? "#00e67622" : "#ff525222",
                color: status.type==="success" ? "#00e676" : "#ff5252",
                fontWeight:600, fontSize:14
              }}>{status.msg}</div>
            )}

            <button onClick={handleSubmit} disabled={saving} style={{
              ...s.btn,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer"
            }}>
              {saving ? "Saving..." : "Submit Score"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [liveSchedule, setLiveSchedule] = useState(S4_SCHEDULE_BASE);

  useEffect(() => {
    const scoresRef = ref(db, 'scores/s4');
    const unsub = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val() || {};
      const merged = S4_SCHEDULE_BASE.map((week, wi) => ({
        ...week,
        matches: week.matches.map((m, mi) => {
          const key = `w${wi+1}m${mi}`;
          if (data[key]) return {...m, ...data[key]};
          return m;
        })
      }));
      setLiveSchedule(merged);
    });
    return () => unsub();
  }, []);

  const s4Stats = useMemo(() => calcS4Stats(liveSchedule), [liveSchedule]);
  const teamStandings = useMemo(() => calcTeamStandings(), []);
  const histStats = useMemo(() => calcHistStats(liveSchedule), [liveSchedule]);

  const recentResults = useMemo(() => {
    const results = [];
    for (let wi = liveSchedule.length-1; wi>=0; wi--) {
      for (let mi = liveSchedule[wi].matches.length-1; mi>=0; mi--) {
        const m = liveSchedule[wi].matches[mi];
        if (m.scores && m.result) {
          results.push({...m, week: liveSchedule[wi].week, date: liveSchedule[wi].date});
          if (results.length >= 4) return results;
        }
      }
    }
    return results;
  }, [liveSchedule]);

  const getTeam = id => TEAMS.find(t => t.id === id);

  const waS4 = () => {
    let t = `🎾 *DEGENERATES PADEL LEAGUE*\n*🏓 Padelmaxxing — Season 4 Standings*\n\n`;
    s4Stats.forEach((p,i) => {
      const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"   ";
      t += `${medal} ${i+1}. ${p.name.padEnd(10)} ${p.pts}pts  ${p.wins}W-${p.losses}L\n`;
    });
    t += `\n_Updated ${TODAY.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}_`;
    navigator.clipboard.writeText(t).catch(()=>{});
    alert("Copied to clipboard! Paste into WhatsApp 🎾");
  };

  const styles = {
    app: { minHeight:"100vh", background:"#0a0a0f", color:"#e0e0e0", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" },
    nav: { background:"#0d0d1a", borderBottom:"1px solid #1e1e2e", position:"sticky", top:0, zIndex:100 },
    navInner: { maxWidth:900, margin:"0 auto", display:"flex", overflowX:"auto", padding:"0 8px" },
    tab: (active) => ({
      padding:"14px 16px", fontSize:13, fontWeight:600, cursor:"pointer",
      color: active?"#00d4ff":"#666", borderBottom: active?"2px solid #00d4ff":"2px solid transparent",
      whiteSpace:"nowrap", background:"none", border:"none", borderBottom: active?"2px solid #00d4ff":"2px solid transparent",
      transition:"color 0.2s"
    }),
    main: { maxWidth:900, margin:"0 auto", padding:"24px 16px" },
    card: { background:"#12121a", borderRadius:16, padding:20, border:"1px solid #1e1e2e", marginBottom:16 },
    h2: { color:"#e0e0e0", fontSize:20, fontWeight:700, margin:"0 0 16px" },
    h3: { color:"#888", fontSize:13, fontWeight:600, textTransform:"uppercase", letterSpacing:1, margin:"0 0 12px" },
    badge: (color) => ({
      display:"inline-block", background:color+"22", color:color,
      borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700
    }),
    statGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 },
    statCard: { background:"#12121a", borderRadius:14, padding:16, textAlign:"center", border:"1px solid #1e1e2e" },
    statVal: { fontSize:32, fontWeight:800, color:"#00d4ff", lineHeight:1 },
    statLbl: { fontSize:12, color:"#666", marginTop:4 },
    table: { width:"100%", borderCollapse:"collapse" },
    th: { color:"#555", fontSize:12, fontWeight:600, textTransform:"uppercase", padding:"8px 10px", textAlign:"left", borderBottom:"1px solid #1e1e2e" },
    td: { padding:"10px 10px", borderBottom:"1px solid #0f0f1a", fontSize:14 },
    pill: { display:"inline-flex", alignItems:"center", gap:6, background:"#1a1a2e", borderRadius:20, padding:"4px 10px", fontSize:13 },
    matchCard: { background:"#0f0f1a", borderRadius:12, padding:16, marginBottom:10, border:"1px solid #1a1a2a" },
    scoreRow: { display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 },
    setScore: { display:"inline-block", background:"#1a1a2e", borderRadius:6, padding:"3px 10px", fontSize:13, fontWeight:700, margin:"0 2px" },
  };

  const renderHome = () => (
    <div>
      <div style={{textAlign:"center",marginBottom:28}}>
        <img src={LOGO_BANNER_URL} alt="DPL" style={{maxWidth:"100%",borderRadius:12,maxHeight:140,objectFit:"cover"}} />
      </div>
      <div style={styles.statGrid}>
        {[{v:"68",l:"Matches"},{v:"3",l:"Seasons"},{v:"10",l:"Players"}].map(x=>(
          <div key={x.l} style={styles.statCard}>
            <div style={styles.statVal}>{x.v}</div>
            <div style={styles.statLbl}>{x.l}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={styles.h3}>🏓 Padelmaxxing — Current Standings</div>
          <button onClick={waS4} style={{background:"#25D36622",color:"#25D366",border:"1px solid #25D36644",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            📤 Share
          </button>
        </div>
        {s4Stats.slice(0,5).map((p,i) => (
          <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid #0f0f1a"}}>
            <div style={{width:24,color:i<3?["#ffd700","#c0c0c0","#cd7f32"][i]:"#444",fontWeight:700,fontSize:15,textAlign:"center"}}>
              {i<3?["🥇","🥈","🥉"][i]:i+1}
            </div>
            <Avatar name={p.name} size={32} />
            <div style={{flex:1,fontWeight:600}}>{p.name}</div>
            <div style={{color:"#00d4ff",fontWeight:700,fontSize:15}}>{p.pts}pts</div>
            <div style={{color:"#666",fontSize:13}}>{p.wins}W-{p.losses}L</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.h3}>⚡ Recent Results</div>
        {recentResults.map((m,i) => (
          <div key={i} style={styles.matchCard}>
            <div style={{color:"#555",fontSize:11,marginBottom:8}}>Week {m.week} · {m.date}</div>
            <div style={styles.scoreRow}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Avatar name={m.p1} size={24}/><Avatar name={m.p2} size={24}/>
                <span style={{fontWeight:600,fontSize:14}}>{m.p1} & {m.p2}</span>
              </div>
              <div style={{display:"flex",gap:4}}>
                {m.scores.map((s,si)=><span key={si} style={styles.setScore}>{s}</span>)}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:600,fontSize:14}}>{m.p3} & {m.p4}</span>
                <Avatar name={m.p3} size={24}/><Avatar name={m.p4} size={24}/>
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:8}}>
              <span style={styles.badge(m.result[0]>m.result[1]?"#00d4ff":"#ff9800")}>
                {m.result[0]>m.result[1]?`${m.p1} & ${m.p2} won`:`${m.p3} & ${m.p4} won`} {m.result[0]}-{m.result[1]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderS4 = () => {
    const upcoming = [];
    liveSchedule.forEach(w => {
      w.matches.forEach(m => {
        if (!m.scores) upcoming.push({...m, week:w.week, date:w.date});
      });
    });
    return (
      <div>
        <div style={{background:"linear-gradient(135deg,#00d4ff22,#0a0a0f)",border:"1px solid #00d4ff33",borderRadius:16,padding:20,marginBottom:24,textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>🏓</div>
          <div style={{color:"#00d4ff",fontSize:22,fontWeight:800}}>Padelmaxxing</div>
          <div style={{color:"#888",fontSize:14}}>Season 4 · Individual League</div>
        </div>

        <div style={styles.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={styles.h2}>Standings</div>
            <button onClick={waS4} style={{background:"#25D36622",color:"#25D366",border:"1px solid #25D36644",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              📤 WhatsApp
            </button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Player</th>
                <th style={styles.th}>P</th>
                <th style={styles.th}>W</th>
                <th style={styles.th}>L</th>
                <th style={styles.th}>Sets</th>
                <th style={styles.th}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {s4Stats.map((p,i) => (
                <tr key={p.name} style={{background:i%2===0?"transparent":"#ffffff04"}}>
                  <td style={styles.td}>
                    <span style={{color:i<3?["#ffd700","#c0c0c0","#cd7f32"][i]:"#555",fontWeight:700}}>
                      {i<3?["🥇","🥈","🥉"][i]:i+1}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Avatar name={p.name} size={26}/>
                      <span style={{fontWeight:600}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{...styles.td,color:"#888"}}>{p.played}</td>
                  <td style={{...styles.td,color:"#00e676"}}>{p.wins}</td>
                  <td style={{...styles.td,color:"#ff5252"}}>{p.losses}</td>
                  <td style={{...styles.td,color:"#888",fontSize:12}}>{p.setsW}-{p.setsL}</td>
                  <td style={{...styles.td,color:"#00d4ff",fontWeight:700,fontSize:16}}>{p.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:12,padding:"10px 12px",background:"#0f0f1a",borderRadius:8,fontSize:12,color:"#666"}}>
            Scoring: Win 3-0 = 3pts · Win 2-1 = 2pts · Loss 1-2 = 1pt · Loss 0-3 = 0pts
          </div>
        </div>

        {upcoming.length > 0 && (
          <div style={styles.card}>
            <div style={styles.h2}>Upcoming Matches</div>
            {upcoming.map((m,i) => (
              <div key={i} style={{...styles.matchCard, border:"1px solid #00d4ff22"}}>
                <div style={{color:"#00d4ff",fontSize:11,fontWeight:700,marginBottom:8}}>WEEK {m.week} · {m.date}</div>
                <div style={styles.scoreRow}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <Avatar name={m.p1} size={26}/><Avatar name={m.p2} size={26}/>
                    <span style={{fontWeight:600,fontSize:14}}>{m.p1} & {m.p2}</span>
                  </div>
                  <div style={{color:"#444",fontWeight:800}}>VS</div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontWeight:600,fontSize:14}}>{m.p3} & {m.p4}</span>
                    <Avatar name={m.p3} size={26}/><Avatar name={m.p4} size={26}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.h2}>Full Schedule</div>
          {liveSchedule.map(w => (
            <div key={w.week} style={{marginBottom:20}}>
              <div style={{color:"#00d4ff",fontSize:13,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                <span style={{background:"#00d4ff22",borderRadius:6,padding:"3px 10px"}}>Week {w.week}</span>
                <span style={{color:"#555",fontSize:12}}>{w.date}</span>
              </div>
              {w.matches.map((m,mi) => (
                <div key={mi} style={styles.matchCard}>
                  <div style={styles.scoreRow}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <Avatar name={m.p1} size={24}/><Avatar name={m.p2} size={24}/>
                      <span style={{fontWeight:600,fontSize:13}}>{m.p1} & {m.p2}</span>
                    </div>
                    <div>
                      {m.scores ? (
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                          <div style={{display:"flex",gap:4}}>
                            {m.scores.map((s,si)=><span key={si} style={styles.setScore}>{s}</span>)}
                          </div>
                          <span style={styles.badge(m.result[0]>m.result[1]?"#00d4ff":"#ff9800")}>
                            {m.result[0]}-{m.result[1]}
                          </span>
                        </div>
                      ) : (
                        <span style={{color:"#333",fontSize:12}}>TBD</span>
                      )}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontWeight:600,fontSize:13}}>{m.p3} & {m.p4}</span>
                      <Avatar name={m.p3} size={24}/><Avatar name={m.p4} size={24}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderS3 = () => {
    const t2 = getTeam("t2");
    return (
      <div>
        <div style={{background:"linear-gradient(135deg,#ffd70022,#0a0a0f)",border:"1px solid #ffd70033",borderRadius:16,padding:24,marginBottom:24,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:8}}>🏆</div>
          <div style={{color:"#ffd700",fontSize:24,fontWeight:800}}>Season 3 Champions</div>
          <div style={{color:"#e0e0e0",fontSize:20,fontWeight:700,marginTop:4}}>{t2?.emoji} {t2?.name}</div>
          <div style={{color:"#888",fontSize:15,marginTop:4}}>Byron & Keagan</div>
        </div>

        <div style={styles.card}>
          <div style={styles.h2}>Final Standings</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Team</th>
                <th style={styles.th}>P</th>
                <th style={styles.th}>W</th>
                <th style={styles.th}>L</th>
                <th style={styles.th}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {teamStandings.map((t,i) => {
                const team = getTeam(t.id);
                return (
                  <tr key={t.id} style={{background:i%2===0?"transparent":"#ffffff04"}}>
                    <td style={styles.td}><span style={{fontWeight:700,color:i<3?["#ffd700","#c0c0c0","#cd7f32"][i]:"#555"}}>{i+1}</span></td>
                    <td style={styles.td}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span>{t.emoji}</span>
                        <span style={{fontWeight:700,color:t.color}}>{t.name}</span>
                        <span style={{color:"#555",fontSize:12}}>{team?.p1} & {team?.p2}</span>
                      </div>
                    </td>
                    <td style={{...styles.td,color:"#888"}}>{t.p}</td>
                    <td style={{...styles.td,color:"#00e676"}}>{t.w}</td>
                    <td style={{...styles.td,color:"#ff5252"}}>{t.l}</td>
                    <td style={{...styles.td,color:"#ffd700",fontWeight:700}}>{t.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <div style={styles.h2}>Knockout Results</div>
          {[...S3_SEMIS, S3_FINAL].map((m,i) => {
            const t1 = getTeam(m.t1); const t2g = getTeam(m.t2);
            const t1Won = m.score1 > m.score2;
            return (
              <div key={i} style={styles.matchCard}>
                <div style={{color:i<2?"#ff9800":"#ffd700",fontSize:11,fontWeight:700,marginBottom:8}}>
                  {i===0?"⚡ SEMI-FINAL 1":i===1?"⚡ SEMI-FINAL 2":"🏆 FINAL"}
                </div>
                <div style={styles.scoreRow}>
                  <div>
                    <span style={{fontWeight:700,color:t1Won?t1?.color:"#555"}}>{t1?.emoji} {t1?.name}</span>
                    <div style={{color:"#555",fontSize:11}}>{t1?.p1} & {t1?.p2}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:800,fontSize:20,color:"#e0e0e0"}}>{m.score1}–{m.score2}</div>
                    <div style={{display:"flex",gap:3,marginTop:4}}>
                      {m.sets.map((s,si)=><span key={si} style={styles.setScore}>{s.s1}-{s.s2}</span>)}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontWeight:700,color:!t1Won?t2g?.color:"#555"}}>{t2g?.emoji} {t2g?.name}</span>
                    <div style={{color:"#555",fontSize:11}}>{t2g?.p1} & {t2g?.p2}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div>
      <div style={{...styles.card,marginBottom:24}}>
        <div style={styles.h2}>All-Time Individual Stats</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Player</th>
              <th style={styles.th}>Played</th>
              <th style={styles.th}>Won</th>
              <th style={styles.th}>Lost</th>
              <th style={styles.th}>Win%</th>
            </tr>
          </thead>
          <tbody>
            {histStats.map((p,i) => {
              const pct = p.played > 0 ? Math.round((p.wins/p.played)*100) : 0;
              return (
                <tr key={p.name} style={{background:i%2===0?"transparent":"#ffffff04"}}>
                  <td style={styles.td}><span style={{color:"#555",fontWeight:700}}>{i+1}</span></td>
                  <td style={styles.td}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Avatar name={p.name} size={28}/>
                      <span style={{fontWeight:600}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{...styles.td,color:"#888"}}>{p.played}</td>
                  <td style={{...styles.td,color:"#00e676",fontWeight:700}}>{p.wins}</td>
                  <td style={{...styles.td,color:"#ff5252"}}>{p.losses}</td>
                  <td style={styles.td}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,background:"#1a1a2e",borderRadius:4,height:6,overflow:"hidden",minWidth:60}}>
                        <div style={{width:`${pct}%`,height:"100%",background:pct>=60?"#00e676":pct>=40?"#ffd700":"#ff5252",borderRadius:4}}/>
                      </div>
                      <span style={{color:pct>=60?"#00e676":pct>=40?"#ffd700":"#ff5252",fontWeight:700,fontSize:13,minWidth:32}}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    {id:"home", label:"🏠 Home"},
    {id:"s4",   label:"🏓 Season 4"},
    {id:"s3",   label:"🏆 Season 3"},
    {id:"history", label:"📊 History"},
    {id:"entry",   label:"📝 Score Entry"},
  ];

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          {tabs.map(t => (
            <button key={t.id} style={styles.tab(tab===t.id)} onClick={()=>setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
      <main style={styles.main}>
        {tab==="home"    && renderHome()}
        {tab==="s4"      && renderS4()}
        {tab==="s3"      && renderS3()}
        {tab==="history" && renderHistory()}
        {tab==="entry"   && <ScoreEntry liveSchedule={liveSchedule} />}
      </main>
    </div>
  );
}
