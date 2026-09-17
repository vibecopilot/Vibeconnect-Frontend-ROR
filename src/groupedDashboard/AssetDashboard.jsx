import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import "./facilityos.css";
import dashboardApi from "./api/dashboardApi.js";
import { getItemInLocalStorage } from "../utils/localStorage";
import Navbar from "../components/Navbar";

// ── Discipline detection ───────────────────────────────────────────────────────
const DISC = {
  hvac:  ["AC","HVAC","Chiller","AHU","FCU","cooling","vrf","ventilation",
          "air condition","air handling","air-condition","hvac","refriger",
          "central ac","split ac","ductable","fan coil","cooling tower","heat pump"],
  dg:    ["DG","DG Set","DG Sets","Generator","Genset","DKG","diesel",
          "diesel generator","gen set","alternator","emergency power","standby power"],
  elev:  ["Elevator","Elevators","Lift","Escalator","travelator","dumbwaiter"],
  fire:  ["Fire","Fire & Safety","Alarm","Sprinkler","Hydrant","suppression","extinguisher",
          "fire fighting","firefighting","smoke","noc","fire safety","fire protection"],
  ups:   ["UPS","Electrical","Panel","Power","MDB","switchgear",
          "inverter","battery bank","dg panel","lt panel","ht panel","apfc",
          "transformer","capacitor bank","rectifier","mcc panel"],
  water: ["Water","plumbing","STP","WTP","Pump","tank","hws",
          "sewage","sewage treatment","water treatment","effluent",
          "bore well","borewell","overhead tank","sump","water supply","drainage"],
  digi:  ["DIGI","Security","Camera","CCTV","BMS","access control","intercom",
          "surveillance","pa system","public address","building management"],
};

// Discipline lookup: asset_group can optionally carry a `discipline` field
// (set via DB column) to override keyword detection for ambiguous names.
const getDisc = (cat, overrideDisc) => {
  if (overrideDisc && overrideDisc !== "") return overrideDisc;
  const c = cat.toLowerCase();
  for (const [d, keys] of Object.entries(DISC)) {
    if (keys.some(k => c.includes(k.toLowerCase()))) return d;
  }
  return "general";
};

const CAT_ICON = {
  hvac:"❄️", dg:"⚡", elev:"🛗", fire:"🔥", ups:"🔋", water:"💧", digi:"📡", general:"⚙️",
};
// cat can be a string (category name) or an object {category, discipline}
const catIcon = (cat) => {
  if (typeof cat === "object") return CAT_ICON[getDisc(cat.category, cat.discipline)] || "⚙️";
  return CAT_ICON[getDisc(cat)] || "⚙️";
};

const scoreLabel = (v) =>
  v >= 90 ? "Excellent" : v >= 75 ? "Good" : v >= 60 ? "Fair" : v >= 40 ? "At Risk" : "Critical";

// FHI formula: HVAC×30 + DG×20 + Fire×20 + Elevator×15 + UPS×10 + Water×5
const DISC_WEIGHT = { hvac:0.30, dg:0.20, fire:0.20, elev:0.15, ups:0.10, water:0.05 };
const computeFHI = (cats) => {
  if (!cats.length) return 0;
  let ws=0, tw=0;
  cats.forEach(c => { const d=getDisc(c.category,c.discipline); const w=DISC_WEIGHT[d]||0; ws+=c.health_percentage*w; tw+=w; });
  const unweighted = cats.filter(c=>!DISC_WEIGHT[getDisc(c.category,c.discipline)]);
  if (unweighted.length && tw<1) {
    const share=(1-tw)/unweighted.length;
    unweighted.forEach(c=>{ws+=c.health_percentage*share; tw+=share;});
  }
  return tw>0 ? ws/tw : cats.reduce((s,c)=>s+c.health_percentage,0)/cats.length;
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:"var(--fos-bg)", card:"var(--fos-card)", card2:"var(--fos-card2)",
  border:"var(--fos-border)", bord2:"var(--fos-border2)",
  text:"var(--fos-text)", muted:"var(--fos-muted)", dim:"var(--fos-dim)",
  ok:"var(--fos-ok)", warn:"var(--fos-warn)", crit:"var(--fos-crit)", accent:"var(--fos-accent)",
};

// ── Compute KPI values from API data ──────────────────────────────────────────
const buildKpiValues = (catSummary, drillRecords) => {
  const total = catSummary.total||0;
  const operational = catSummary.operational||0;
  const pct = catSummary.health_percentage||0;
  const breakdowns = drillRecords.filter(a=>a.breakdown===true||a.breakdown===1).length;
  return {
    availability:    total>0 ? `${((operational/total)*100).toFixed(1)}%` : "—",
    health_pct:      `${pct.toFixed(0)}%`,
    breakdown_count: String(breakdowns),
    total:           String(total),
  };
};

// ── Atoms ─────────────────────────────────────────────────────────────────────
const Dot = ({ st }) => {
  const s = { ok:{bg:"#059669",cls:"fos-pulse-green"}, warn:{bg:"#d97706",cls:""}, crit:{bg:"#dc2626",cls:"fos-pulse-red"}, na:{bg:"#6b7280",cls:""} }[st]||{bg:"#6b7280",cls:""};
  return <span style={{ display:"inline-block",width:8,height:8,borderRadius:"50%",background:s.bg,flexShrink:0,boxShadow:st==="ok"?"0 0 6px rgba(5,150,105,.5)":st==="crit"?"0 0 6px rgba(220,38,38,.5)":"none" }} className={s.cls} />;
};

const Badge = ({ children, type="ok" }) => {
  const m = { ok:["rgba(5,150,105,.12)","#059669"], warn:["rgba(217,119,6,.12)","#d97706"], crit:["rgba(220,38,38,.12)","#dc2626"], info:["rgba(79,70,229,.12)","#4f46e5"], na:["rgba(107,114,128,.12)","#6b7280"] };
  const [bg,col] = m[type]||m.ok;
  return <span style={{ display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:.5,background:bg,color:col }}>{children}</span>;
};

const AlertBar = ({ type="info", children }) => {
  const m = { crit:{bg:"rgba(220,38,38,.08)",border:"rgba(220,38,38,.22)",color:"#dc2626"}, warn:{bg:"rgba(217,119,6,.08)",border:"rgba(217,119,6,.22)",color:"#d97706"}, info:{bg:"rgba(79,70,229,.07)",border:"rgba(79,70,229,.2)",color:"#4f46e5"} };
  const t = m[type]||m.info;
  return <div style={{ padding:"10px 14px",borderRadius:7,fontSize:12,display:"flex",alignItems:"center",gap:10,marginBottom:10,background:t.bg,border:`1px solid ${t.border}`,color:t.color }}>{children}</div>;
};

const Card = ({ title, children, style={} }) => (
  <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 20px",boxShadow:"0 1px 4px rgba(0,0,0,.06)",...style }}>
    {title && <div style={{ fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.muted,marginBottom:12 }}>{title}</div>}
    {children}
  </div>
);

const Table = ({ heads, rows }) => (
  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12.5 }}>
    <thead>
      <tr>{heads.map(h=><th key={h} style={{ textAlign:"left",padding:"8px 12px",fontSize:9,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:C.dim,borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>
);

// KPI tile with watermark, sub text, and delta indicator (matches reference)
const KpiTile = ({ label, value, sub, status, na=false, loading }) => {
  const col = na ? "#6b7280" : status==="ok" ? "#059669" : status==="warn" ? "#d97706" : status==="crit" ? "#dc2626" : "#4f46e5";
  return (
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderTop:`2px solid ${na?C.border:col}`,borderRadius:10,padding:"15px 17px",flex:1,minWidth:0,position:"relative",overflow:"hidden" }}>
      <div style={{ fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.muted,marginBottom:7 }}>{label}</div>
      {loading
        ? <div style={{ height:28,width:70,background:C.card2,borderRadius:4 }} />
        : <div className="fos-font-mono" style={{ fontSize:26,fontWeight:600,lineHeight:1,color:col }}>{value??'—'}</div>
      }
      {sub && !loading && <div style={{ fontSize:10,color:C.muted,marginTop:5 }}>{sub}</div>}
      {na && !loading && <div style={{ fontSize:9,color:"#6b7280",marginTop:4,fontStyle:"italic" }}>data not yet captured</div>}
      {!na && !loading && (
        <div style={{ position:"absolute",right:-8,bottom:-8,fontFamily:"'Bebas Neue',sans-serif",fontSize:52,opacity:.035,pointerEvents:"none",lineHeight:1,color:C.text,userSelect:"none" }}>
          {typeof value==="string"?value.replace(/[^0-9.%]/g,"").slice(0,3)||label.slice(0,2).toUpperCase():label.slice(0,2).toUpperCase()}
        </div>
      )}
    </div>
  );
};

// Progress bar — flexible: accepts labelRight for custom right text, color override
const ProgBar = ({ label, value, labelRight, color }) => {
  const col = color || (value>=75?"#059669":value>=50?"#d97706":"#dc2626");
  const pct = Math.min(Math.max(value||0, 0), 100);
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3 }}>
        <span style={{ color:C.muted }}>{label}</span>
        <span className="fos-font-mono" style={{ fontSize:11,color:col }}>{labelRight ?? `${pct.toFixed(0)}%`}</span>
      </div>
      <div style={{ height:5,background:C.card2,borderRadius:3,overflow:"hidden" }}>
        <div style={{ height:"100%",borderRadius:3,background:col,width:`${pct}%`,transition:"width .6s ease" }} />
      </div>
    </div>
  );
};

// Timeline item (used in Recent Events and Breakdown History)
const TlItem = ({ date, title, desc, type="info" }) => {
  const col = type==="ok"?"#059669":type==="warn"?"#d97706":type==="crit"?"#dc2626":"#4f46e5";
  return (
    <div style={{ paddingLeft:18,borderLeft:`2px solid rgba(0,0,0,.1)`,position:"relative",marginBottom:14 }}>
      <div style={{ position:"absolute",left:-5,top:4,width:9,height:9,borderRadius:"50%",background:col,border:`2px solid #ffffff` }} />
      <div className="fos-font-mono" style={{ fontSize:10,color:C.dim,marginBottom:2 }}>{date}</div>
      <div style={{ fontSize:12.5,fontWeight:600,color:C.text }}>{title}</div>
      {desc && <div style={{ fontSize:11,color:C.muted,marginTop:2,lineHeight:1.5 }}>{desc}</div>}
    </div>
  );
};

// Sensor reading mini box — shows real value if available, else NA
const ReadingBox = ({ label, value, unit }) => {
  const hasData = value !== null && value !== undefined && value !== "";
  return (
    <div style={{ background:C.card2,borderRadius:7,padding:"10px 8px",textAlign:"center" }}>
      <div style={{ fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:".6px",marginBottom:6 }}>{label}</div>
      <div className="fos-font-mono" style={{ fontSize:20,color:hasData?"#4f46e5":"#6b7280" }}>
        {hasData ? value : "—"}
      </div>
      {hasData && unit && <div style={{ fontSize:9,color:C.muted,marginTop:2 }}>{unit}</div>}
      {!hasData && <div style={{ fontSize:8,color:"#6b7280",marginTop:3,fontStyle:"italic" }}>not captured</div>}
    </div>
  );
};

// NA sensor mini box (IAQ, Fuel, etc.)
const NaBox = ({ label }) => <ReadingBox label={label} value={null} />;

// ── Dynamic KPI tiles — built from actual latest_readings ─────────────────────
// Always shows: Availability + Breakdowns MTD (operational KPIs from API)
// Then fills remaining slots with whatever kpi_key readings the client configured.
const buildKpiTiles = (kpiValues, readings, disc) => {
  // 2 fixed operational tiles
  const fixed = [
    { label:"Availability",   key:"availability",    na:false, sub:"Target ≥95%" },
    { label:"Breakdowns MTD", key:"breakdown_count", na:false, sub:"Target: 0"   },
  ];

  // Deduplicate readings by kpi_key, pick the first occurrence per key
  const seen = new Set();
  const unique = readings.filter(r => {
    if (!r.kpi_key || seen.has(r.kpi_key)) return false;
    seen.add(r.kpi_key);
    return true;
  });

  // Build dynamic tiles from configured readings (up to 3 extras beside fixed 2)
  const dynamic = unique.slice(0, 3).map(r => ({
    label: r.question_name || r.kpi_key,
    key:   r.kpi_key,
    unit:  r.unit_label || "",
    value: r.value,
    na:    false,
  }));

  return [...fixed, ...dynamic];
};

// ── KPI Scorecard definitions ─────────────────────────────────────────────────
const SCORECARD_DEF = {
  hvac: [
    { kpi:"Availability",    target:"≥95%",   key:"availability"  },
    { kpi:"Asset Health",    target:"≥80%",   key:"health_pct"    },
    { kpi:"Breakdown Count", target:"0",       key:"breakdown_count"},
    { kpi:"PM Compliance",   target:"100%",   key:"pm_compliance" },
    { kpi:"kW/TR",           target:"<0.7",   key:"kw_tr"         },
    { kpi:"COP",             target:">3.5",   key:"cop"           },
  ],
  dg: [
    { kpi:"Availability",    target:"≥95%",   key:"availability"  },
    { kpi:"Asset Health",    target:"≥80%",   key:"health_pct"    },
    { kpi:"Breakdown Count", target:"0",       key:"breakdown_count"},
    { kpi:"Fuel Level",      target:"≥30%",   key:"fuel_pct"      },
    { kpi:"Start Success",   target:"100%",   key:"start_success" },
    { kpi:"PM Compliance",   target:"100%",   key:"pm_compliance" },
  ],
  elev: [
    { kpi:"Uptime",          target:"≥98%",   key:"availability"  },
    { kpi:"Asset Health",    target:"≥80%",   key:"health_pct"    },
    { kpi:"Breakdown Count", target:"0",       key:"breakdown_count"},
    { kpi:"Entrapments",     target:"0",       key:"entrapments"   },
    { kpi:"AMC Compliance",  target:"100%",   key:"amc_compliance"},
    { kpi:"Response Time",   target:"<30m",   key:"response_time" },
  ],
  fire: [
    { kpi:"Asset Health",    target:"≥90%",   key:"health_pct"    },
    { kpi:"Breakdowns",      target:"0",       key:"breakdown_count"},
    { kpi:"Compliance",      target:"100%",   key:"compliance_pct"},
    { kpi:"NOC Status",      target:"Valid",  key:"noc_status"    },
    { kpi:"Alarm Count",     target:"0",       key:"alarm_count"   },
    { kpi:"Drill Freq.",     target:"Monthly",key:"drill_freq"    },
  ],
  ups: [
    { kpi:"Availability",    target:"≥98%",   key:"availability"  },
    { kpi:"Asset Health",    target:"≥80%",   key:"health_pct"    },
    { kpi:"Breakdown Count", target:"0",       key:"breakdown_count"},
    { kpi:"PM Compliance",   target:"100%",   key:"pm_compliance" },
    { kpi:"Max Load",        target:"≤80%",   key:"load_pct"      },
    { kpi:"Inverter Eff.",   target:"≥95%",   key:"inverter_eff"  },
  ],
  water: [
    { kpi:"Pump Uptime",     target:"≥95%",   key:"availability"  },
    { kpi:"Asset Health",    target:"≥80%",   key:"health_pct"    },
    { kpi:"Breakdown Count", target:"0",       key:"breakdown_count"},
    { kpi:"PM Compliance",   target:"100%",   key:"pm_compliance" },
    { kpi:"TDS",             target:"≤500",   key:"tds"           },
    { kpi:"STP Efficiency",  target:"≥85%",   key:"stp_eff"       },
  ],
};

// Helper: find a reading by kpi_key first, then fall back to keyword search on question_name
const findR = (rdgs, kpiKey, keywords = []) => {
  if (kpiKey) {
    const byKey = rdgs.find(r => r.kpi_key === kpiKey);
    if (byKey) return byKey;
  }
  if (keywords.length === 0) return undefined;
  return rdgs.find(r => keywords.some(k => r.question_name?.toLowerCase().includes(k.toLowerCase())));
};

// ── Dynamic asset table — renders whatever KPI columns the client configured ──
// Columns are built from the union of kpi_keys that appear across all assets.
// No hardcoded discipline logic — works for any asset type automatically.
const DynamicAssetTable = ({ records, readingByAsset }) => {
  // Collect all unique kpi_keys across all assets, preserve order of first appearance
  const colKeys = [];
  const colMeta = {}; // kpi_key → { label, unit }
  records.forEach(a => {
    (readingByAsset[a.id] || []).forEach(r => {
      if (r.kpi_key && !colMeta[r.kpi_key]) {
        colKeys.push(r.kpi_key);
        colMeta[r.kpi_key] = { label: r.question_name || r.kpi_key, unit: r.unit_label || "" };
      }
    });
  });

  const scoreColor = (v) => v >= 75 ? "#059669" : v >= 50 ? "#d97706" : "#dc2626";
  const scoreLabel = (v) => v >= 85 ? "Excellent" : v >= 70 ? "Good" : v >= 50 ? "Fair" : v >= 30 ? "Poor" : "Critical";

  return (
    <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12.5 }}>
      <thead>
        <tr>
          <th style={{ textAlign:"left",padding:"8px 12px",fontSize:9,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:C.dim,borderBottom:`1px solid ${C.border}` }}>Asset</th>
          <th style={{ textAlign:"left",padding:"8px 12px",fontSize:9,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:C.dim,borderBottom:`1px solid ${C.border}` }}>Health</th>
          {colKeys.map(k => (
            <th key={k} style={{ textAlign:"left",padding:"8px 12px",fontSize:9,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:C.dim,borderBottom:`1px solid ${C.border}` }}>
              {colMeta[k].label}{colMeta[k].unit ? ` (${colMeta[k].unit})` : ""}
            </th>
          ))}
          <th style={{ textAlign:"left",padding:"8px 12px",fontSize:9,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:C.dim,borderBottom:`1px solid ${C.border}` }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map(a => {
          const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
          const stCol = st==="ok"?"#059669":st==="warn"?"#d97706":"#dc2626";
          const stLbl = st==="ok"?"Operational":st==="warn"?"Maintenance":"Critical";
          const hs    = a.health_score;
          const rdgs  = readingByAsset[a.id] || [];
          return (
            <tr key={a.id} style={{ borderBottom:`1px solid ${C.border}` }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{ padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5 }}>{a.name}</td>
              <td style={{ padding:"10px 12px" }}>
                {hs != null
                  ? <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:scoreColor(hs) }}>{hs} <span style={{ fontSize:10,color:C.muted }}>/ {scoreLabel(hs)}</span></span>
                  : <span style={{ color:C.dim,fontSize:11 }}>—</span>
                }
              </td>
              {colKeys.map(k => {
                const r = rdgs.find(rd => rd.kpi_key === k);
                const v = r?.value;
                return (
                  <td key={k} style={{ padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:v!=null?"#3b82f6":C.dim }}>
                    {v != null ? `${v}${colMeta[k].unit ? " "+colMeta[k].unit : ""}` : "—"}
                  </td>
                );
              })}
              <td style={{ padding:"10px 12px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                  <Dot st={st}/>
                  <span style={{ fontSize:11,color:stCol }}>{stLbl}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Keep DISC_TABLE_DEF as an empty object — no longer used but referenced by name in drill view
const DISC_TABLE_DEF = {
  hvac: {
    heads: ["Asset", "Type", "Health", "Key KPI", "Availability", "Status"],
    row: (a, rba) => {
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const stLbl = st==="ok"?"Running":st==="warn"?"Maintenance":"Breakdown";
      const nm    = a.name.toLowerCase();
      const type  = nm.includes("chiller")?"Chiller":nm.includes("ahu")?"AHU":nm.includes("fcu")?"FCU":nm.includes("vrf")?"VRF":nm.includes("cool")||nm.includes("ct-")?"Cool.Tower":"HVAC";
      const rdgs  = rba[a.id]||[];
      const kw    = findR(rdgs,"kw_tr",["kw/tr","kwtr","kw-tr"]);
      const cop   = findR(rdgs,"cop",["cop"]);
      const appr  = findR(rdgs,"approach_temp",["approach"]);
      const dP    = findR(rdgs,"filter_dp",["filter dp","delta p","δp","filter"]);
      const kpi   = a.breakdown?"Compressor Trip":kw?`kW/TR: ${kw.value}`:cop?`COP: ${cop.value}`:appr?`Approach: ${appr.value}°C`:dP?`Filter ΔP: ${dP.value} Pa`:"—";
      const kpiCol= a.breakdown?"#f87171":kw&&parseFloat(kw.value)>0.9?"#facc15":kw?"#34d399":"#6b7280";
      const hs    = a.health_score ?? (st==="ok"?88:st==="warn"?58:44);
      const hLbl  = hs>=85?"Excellent":hs>=70?"Good":hs>=50?"Fair":hs>=30?"Poor":"Critical";
      const hType = hs>=70?"ok":hs>=50?"warn":"crit";
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{type}</td>
          <td style={{padding:"10px 12px"}}><Badge type={hType}>{hs != null ? `${hs}` : "—"} / {hLbl}</Badge></td>
          <td style={{padding:"10px 12px",color:kpiCol,fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{kpi}</td>
          <td style={{padding:"10px 12px",color:stCol,fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>—</td>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Dot st={st}/><span style={{fontSize:11,color:stCol}}>{stLbl}</span></div></td>
        </tr>
      );
    }
  },
  dg: {
    heads: ["Unit", "Capacity", "Fuel %", "Battery V", "Hours Run", "Oil Change", "Status"],
    row: (a, rba) => {
      const rdgs  = rba[a.id]||[];
      const fuel  = findR(rdgs,"fuel_pct",["fuel","diesel","litre","liter"]);
      const batV  = findR(rdgs,"battery_v",["battery","electrolyte","voltage"]);
      const runH  = findR(rdgs,"run_hrs",["running hrs","run hrs","hour meter","runtime"]);
      const oilC  = findR(rdgs,"oil_change",["oil change","oil level","lube"]);
      const cap   = findR(rdgs,null,["capacity","kva"]);
      const fp    = fuel?.value!=null?parseFloat(fuel.value):null;
      const fCol  = fp==null?"#374151":fp>=60?"#34d399":fp>=30?"#facc15":"#f87171";
      const bv    = batV?.value!=null?parseFloat(batV.value):null;
      const bCol  = bv==null?"#374151":bv>=24?"#34d399":bv>=22?"#facc15":"#f87171";
      const bWarn = bv!=null&&bv<24;
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const stLbl = a.breakdown?"Breakdown":bWarn?"Battery Low":st==="ok"?"Standby":"Maintenance";
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{cap?.value?`${cap.value} kVA`:"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:fCol}}>{fp!=null?`${fp}%`:"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:bCol}}>
            {bv!=null?<span>{bv}V{bWarn&&<span style={{color:"#f87171",marginLeft:3,fontSize:9}}>⚠</span>}</span>:"—"}
          </td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{runH?.value?`${runH.value} hrs`:"—"}</td>
          <td style={{padding:"10px 12px",fontSize:11}}>
            {oilC?.value?<Badge type={oilC.value.toLowerCase().includes("done")?"ok":"warn"}>{oilC.value}</Badge>:<span style={{color:C.dim}}>—</span>}
          </td>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Dot st={st}/><span style={{fontSize:11,color:stCol}}>{stLbl}</span></div></td>
        </tr>
      );
    }
  },
  elev: {
    heads: ["Unit", "Location", "Capacity", "Trips/Day", "Last Service", "AMC", "Status"],
    row: (a, rba) => {
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const stLbl = st==="ok"?"Running":st==="warn"?"AMC Due":"Breakdown";
      const rdgs  = rba[a.id]||[];
      const caps  = findR(rdgs,null,["person","passenger","capacity"]);
      const trips = findR(rdgs,"trips_day",["trip","count","cycle"]);
      const svc   = findR(rdgs,null,["service","maintenance","pm"]);
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{a.location||"—"}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{caps?.value?`${caps.value} persons`:"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{trips?.value||"—"}</td>
          <td style={{padding:"10px 12px",fontSize:11,color:C.muted}}>{svc?.recorded_at||"—"}</td>
          <td style={{padding:"10px 12px"}}><Badge type={st==="ok"?"ok":"warn"}>{st==="ok"?"Active":"Due"}</Badge></td>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Dot st={st}/><span style={{fontSize:11,color:stCol}}>{stLbl}</span></div></td>
        </tr>
      );
    }
  },
  fire: {
    heads: ["Asset", "Zone / Location", "Type", "Pressure", "Last Test", "Compliance"],
    row: (a, rba) => {
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const rdgs  = rba[a.id]||[];
      const tst   = findR(rdgs,"detector_ok",["test","check","inspection","drill"]);
      const pres  = findR(rdgs,"pressure",["pressure","bar","psi"]);
      const nm    = a.name.toLowerCase();
      const ftype = nm.includes("sprinkler")?"Sprinkler":nm.includes("hydrant")?"Hydrant":nm.includes("detector")||nm.includes("smoke")?"Detector":nm.includes("panel")?"Panel":"Fire";
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{a.location||"—"}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{ftype}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{pres?.value?`${pres.value} ${pres.unit_label||"bar"}`:"—"}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{tst?.recorded_at||"—"}</td>
          <td style={{padding:"10px 12px"}}><Badge type={st==="ok"?"ok":"warn"}>{st==="ok"?"Compliant":"Review"}</Badge></td>
        </tr>
      );
    }
  },
  ups: {
    heads: ["Asset", "Asset #", "Capacity", "Load %", "Battery V", "Health", "Status"],
    row: (a, rba) => {
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const rdgs  = rba[a.id]||[];
      const load  = findR(rdgs,"ups_load_pct",["load","output"]);
      const batV  = findR(rdgs,"battery_v",["battery","voltage","volt"]);
      const backup= findR(rdgs,"battery_backup",["backup","autonomy"]);
      const lv    = load?.value!=null?parseFloat(load.value):null;
      const lCol  = lv==null?"#374151":lv>=80?"#f87171":lv>=60?"#facc15":"#34d399";
      const hs    = a.health_score ?? (st==="ok"?88:st==="warn"?58:44);
      const hLbl  = hs>=70?"Good":hs>=50?"Fair":"Poor";
      const hType = hs>=70?"ok":hs>=50?"warn":"crit";
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{a.asset_number||"—"}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{backup?.value?`${backup.value} hrs`:"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:lCol}}>{lv!=null?`${lv}%`:"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:batV?"#3b82f6":C.dim}}>{batV?.value?`${batV.value}V`:"—"}</td>
          <td style={{padding:"10px 12px"}}><Badge type={hType}>{hs != null ? `${hs}` : "—"} / {hLbl}</Badge></td>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Dot st={st}/><span style={{fontSize:11,color:stCol}}>{st==="ok"?"Operational":st==="warn"?"Warning":"Critical"}</span></div></td>
        </tr>
      );
    }
  },
  water: {
    heads: ["Asset", "Type / Location", "TDS / pH", "Pressure", "Flow Rate", "Health", "Status"],
    row: (a, rba) => {
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const rdgs  = rba[a.id]||[];
      const tds   = findR(rdgs,"tds_ppm",["tds"]);
      const ph    = findR(rdgs,"ph_level",["ph","acidity"]);
      const pres  = findR(rdgs,"pressure",["pressure","bar","psi"]);
      const flow  = findR(rdgs,"flow_rate",["flow","lpm","lph","rate"]);
      const key   = tds?`TDS: ${tds.value} ppm`:ph?`pH: ${ph.value}`:"—";
      const hs    = a.health_score ?? (st==="ok"?88:st==="warn"?58:44);
      const hLbl  = hs>=70?"Good":hs>=50?"Fair":"Poor";
      const hType = hs>=70?"ok":hs>=50?"warn":"crit";
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600,fontSize:12.5}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:11}}>{a.location||"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#3b82f6"}}>{key}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{pres?.value?`${pres.value} ${pres.unit_label||"bar"}`:"—"}</td>
          <td style={{padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{flow?.value?`${flow.value} ${flow.unit_label||"LPM"}`:"—"}</td>
          <td style={{padding:"10px 12px"}}><Badge type={hType}>{hs != null ? `${hs}` : "—"} / {hLbl}</Badge></td>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Dot st={st}/><span style={{fontSize:11,color:stCol}}>{st==="ok"?"Running":st==="warn"?"Maintenance":"Critical"}</span></div></td>
        </tr>
      );
    }
  },
  general: {
    heads: ["Asset", "Asset #", "Location", "Key Metric", "Health", "Status"],
    row: (a, rba) => {
      const st    = a.active===false||a.active===0?"crit":a.critical?"crit":a.breakdown?"warn":"ok";
      const stCol = st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
      const label = st==="crit"?"Critical":st==="warn"?"Maintenance":"Operational";
      const hs    = a.health_score ?? (st==="ok"?88:st==="warn"?58:44);
      const hLbl  = hs>=70?"Good":hs>=50?"Fair":"Poor";
      const hType = hs>=70?"ok":hs>=50?"warn":"crit";
      const rdgs  = rba[a.id]||[];
      const first = rdgs[0];
      const metric= a.breakdown?"Breakdown: Active":a.critical?"Status: Critical":first?`${first.question_name}: ${first.value}`:"Status: Normal";
      return (
        <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 12px",color:C.text,fontWeight:600}}>{a.name}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{a.asset_number||"—"}</td>
          <td style={{padding:"10px 12px",color:C.muted,fontSize:12}}>{a.location||"—"}</td>
          <td style={{padding:"10px 12px",color:C.dim,fontFamily:"monospace",fontSize:11}}>{metric}</td>
          <td style={{padding:"10px 12px"}}><Badge type={hType}>{hs != null ? `${hs}` : "—"} / {hLbl}</Badge></td>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Dot st={st}/><span style={{fontSize:11,color:stCol}}>{label}</span></div></td>
        </tr>
      );
    }
  },
};

// ── Discipline-specific right panel ──────────────────────────────────────────
const DiscPanel = ({ disc, records, drillSummary, catSummary, readings = [] }) => {
  const total = drillSummary.total || catSummary.total || 0;
  const breakdown_assets = records.filter(a=>a.breakdown===true||a.breakdown===1);
  const critical_assets  = records.filter(a=>a.critical===true||a.critical===1);

  // Build lookup: question_name.toLowerCase() → { value, unit, asset_id }
  // and per-asset lookup: asset_id → [{ question_name, value, unit }]
  const readingByQ = {};
  const readingByAsset = {};
  readings.forEach(r => {
    const qk = r.question_name.toLowerCase();
    if (!readingByQ[qk]) readingByQ[qk] = r;
    if (!readingByAsset[r.asset_id]) readingByAsset[r.asset_id] = [];
    readingByAsset[r.asset_id].push(r);
  });

  // Find first reading matching any of the given keyword patterns
  const findReading = (...patterns) => {
    for (const [qk, r] of Object.entries(readingByQ)) {
      if (patterns.some(p => qk.includes(p.toLowerCase()))) return r;
    }
    return null;
  };

  const statusBars = (
    <Card title="Status Distribution">
      {[
        { label:"Operational", value:drillSummary.operational||catSummary.operational||0, col:"#34d399" },
        { label:"Maintenance",  value:drillSummary.maintenance||0, col:"#facc15" },
        { label:"Critical",     value:drillSummary.critical||0,    col:"#f87171" },
        { label:"Offline",      value:drillSummary.offline||0,     col:"#374151" },
      ].map(b=>(
        <div key={b.label} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3 }}>
            <span style={{ color:C.muted }}>{b.label}</span>
            <span className="fos-font-mono" style={{ fontSize:11,color:b.col }}>{b.value}</span>
          </div>
          <div style={{ height:4,background:C.card2,borderRadius:3,overflow:"hidden" }}>
            <div style={{ height:"100%",borderRadius:3,background:b.col,width:`${total>0?(b.value/total)*100:0}%`,transition:"width .6s ease" }} />
          </div>
        </div>
      ))}
    </Card>
  );

  if (disc==="hvac") {
    const co2  = findReading("co2","carbon dioxide","co₂");
    const pm25 = findReading("pm2.5","pm 2.5","particulate","dust");
    const temp = findReading("temperature","temp","degree");
    const hum  = findReading("humidity","rh","relative humidity");
    const kwh  = findReading("kwh","kw","energy","power");
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Card title="IAQ Live Readings">
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <ReadingBox label="CO₂ (ppm)"    value={co2?.value}  unit={co2?.unit_label  ||"ppm"} />
            <ReadingBox label="PM2.5 µg/m³"  value={pm25?.value} unit={pm25?.unit_label ||"µg/m³"} />
            <ReadingBox label="Temperature"   value={temp?.value} unit={temp?.unit_label ||"°C"} />
            <ReadingBox label="Humidity RH%"  value={hum?.value}  unit={hum?.unit_label  ||"%"} />
          </div>
          {!co2&&!pm25&&!temp&&!hum && <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic" }}>Sensor integration required for live IAQ data</div>}
        </Card>
        <Card title="Energy Readings">
          <ReadingBox label={kwh?.question_name||"kWh / Load"} value={kwh?.value} unit={kwh?.unit_label||"kWh"} />
          <div style={{ marginTop:10 }}>
            <ProgBar label="Planned PM" value={0} labelRight="—" color="#3b82f6" />
            <ProgBar label="Reactive"   value={0} labelRight="—" color="#facc15" />
          </div>
          {!kwh && <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:4 }}>Meter readings required for energy data</div>}
        </Card>
        {statusBars}
      </div>
    );
  }

  if (disc==="dg") {
    const batV   = findReading("battery","electrolyte","voltage");
    const runHrs = findReading("running hrs","run hrs","hour","kwh opening","kwh closing","dg kwh");
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Card title="DG Key Readings">
          {records.slice(0,6).map(a=>{
            const assetReadings = readingByAsset[a.id] || [];
            const bv = assetReadings.find(r=>["battery","electrolyte","voltage"].some(k=>r.question_name.toLowerCase().includes(k)));
            const hr = assetReadings.find(r=>["running hrs","run hrs","kwh","hour"].some(k=>r.question_name.toLowerCase().includes(k)));
            const lbl = a.name.length>22?a.name.slice(0,20)+"…":a.name;
            return (
              <div key={a.id} style={{ marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11,color:C.muted,marginBottom:4,fontWeight:600 }}>{lbl}</div>
                <div style={{ display:"flex",gap:8 }}>
                  <div style={{ flex:1,background:C.card2,borderRadius:5,padding:"5px 8px",textAlign:"center" }}>
                    <div style={{ fontSize:8,color:C.dim }}>BATTERY V</div>
                    <div className="fos-font-mono" style={{ fontSize:14,color:bv?"#3b82f6":"#374151" }}>{bv?bv.value:"—"}</div>
                  </div>
                  <div style={{ flex:1,background:C.card2,borderRadius:5,padding:"5px 8px",textAlign:"center" }}>
                    <div style={{ fontSize:8,color:C.dim }}>RUN HRS / kWh</div>
                    <div className="fos-font-mono" style={{ fontSize:14,color:hr?"#34d399":"#374151" }}>{hr?hr.value:"—"}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {records.length===0 && <div style={{ fontSize:11,color:"#374151" }}>No DG units found</div>}
          {!batV&&!runHrs && <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:4 }}>Tag questions with field_type=numeric for auto-capture</div>}
        </Card>
        {statusBars}
      </div>
    );
  }

  if (disc==="elev") return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <Card title="Breakdown History (MTD)">
        {breakdown_assets.length>0
          ? breakdown_assets.slice(0,4).map(a=>(
              <TlItem key={a.id} type="crit"
                date={`Asset #${a.asset_number||a.id}`}
                title={a.name}
                desc={`Location: ${a.location||"—"} · Active breakdown`} />
            ))
          : <div style={{ textAlign:"center",color:"#34d399",padding:"14px 0",fontSize:12 }}>✅ No breakdowns MTD</div>
        }
      </Card>
      {statusBars}
    </div>
  );

  if (disc==="fire") return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <Card title="Zone Status">
        {["Basement","Ground – 3F","4F – 8F","9F – 12F","Roof / Plant"].map((z,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:12 }}>
            <span style={{ color:C.muted }}>{z}</span>
            <Badge type="na">—</Badge>
          </div>
        ))}
        <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:8 }}>Zone config not yet mapped</div>
      </Card>
      <Card title="Compliance & Regulatory">
        <ProgBar label="NOC / Form C" value={0} labelRight="—" color="#374151" />
        <ProgBar label="Mock Drill Compliance" value={0} labelRight="—" color="#374151" />
        <ProgBar label="Extinguisher Check" value={0} labelRight="—" color="#374151" />
        <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:4 }}>Regulatory data requires compliance module</div>
      </Card>
      {statusBars}
    </div>
  );

  if (disc==="ups") {
    const batV  = findReading("battery","voltage");
    const temp  = findReading("temperature","temp","inverter");
    const freq  = findReading("frequency","hz","freq");
    const kwh   = findReading("kwh","kw","energy","load","power");
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Card title="Electrical Readings">
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <ReadingBox label="Battery Voltage" value={batV?.value}  unit={batV?.unit_label ||"V"} />
            <ReadingBox label="Inverter Temp"   value={temp?.value}  unit={temp?.unit_label ||"°C"} />
            <ReadingBox label="Frequency"        value={freq?.value}  unit={freq?.unit_label ||"Hz"} />
            <ReadingBox label="kWh / Load"       value={kwh?.value}   unit={kwh?.unit_label  ||"kWh"} />
          </div>
          {records.slice(0,4).map(a=>{
            const ar = readingByAsset[a.id]||[];
            const bv = ar.find(r=>["battery","voltage"].some(k=>r.question_name.toLowerCase().includes(k)));
            return bv ? (
              <div key={a.id} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:11 }}>
                <span style={{ color:C.muted }}>{a.name.length>24?a.name.slice(0,22)+"…":a.name}</span>
                <span className="fos-font-mono" style={{ color:"#3b82f6" }}>{bv.value} V</span>
              </div>
            ) : null;
          })}
          {!batV&&!temp&&!freq&&!kwh && <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:4 }}>Tag questions with field_type=numeric for auto-capture</div>}
        </Card>
        {statusBars}
      </div>
    );
  }

  if (disc==="water") {
    const tds  = findReading("tds","total dissolved");
    const ph   = findReading("ph","acidity","alkalinity");
    const turb = findReading("turbidity","ntu");
    const bod  = findReading("bod","stp","sewage");
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Card title="Water Quality Parameters">
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <ReadingBox label="TDS (≤500 ppm)"   value={tds?.value}  unit={tds?.unit_label ||"ppm"} />
            <ReadingBox label="pH (6.5–8.5)"     value={ph?.value}   unit={ph?.unit_label  ||""} />
            <ReadingBox label="Turbidity (≤1 NTU)" value={turb?.value} unit={turb?.unit_label||"NTU"} />
            <ReadingBox label="STP BOD (≤30)"    value={bod?.value}  unit={bod?.unit_label ||"mg/L"} />
          </div>
          {!tds&&!ph&&!turb&&!bod && <div style={{ fontSize:10,color:"#6b7280",fontStyle:"italic" }}>Sensor integration required for water quality</div>}
        </Card>
        {statusBars}
      </div>
    );
  }

  // General — show any available readings + breakdown timeline
  const hasReadings = readings.length > 0;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      {hasReadings && (
        <Card title={`Sensor Readings (${readings.length})`}>
          {readings.slice(0,8).map((r,i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:11 }}>
              <span style={{ color:C.muted }}>{r.question_name}</span>
              <span className="fos-font-mono" style={{ color:"#3b82f6" }}>{r.value}{r.unit_label?" "+r.unit_label:""}</span>
            </div>
          ))}
        </Card>
      )}
      {breakdown_assets.length>0 && (
        <Card title="Breakdown Assets">
          {breakdown_assets.slice(0,4).map(a=>(
            <TlItem key={a.id} type="warn"
              date={`#${a.asset_number||a.id}`}
              title={a.name}
              desc={a.location||"—"} />
          ))}
        </Card>
      )}
      {statusBars}
    </div>
  );
};

// ── Discipline-specific bottom 2 cards (middle + right of bottom 3-col grid) ──
// Returns a React Fragment with 2 <Card> elements — inserted after KPI Scorecard.
const DiscBottomCards = ({
  disc, records, drillSummary, catSummary,
  readings, breakdownAssets, criticalAssets, totalCnt, operCnt
}) => {
  // Build per-asset reading lookup for bottom cards
  const rba = {};
  readings.forEach(r => { if (!rba[r.asset_id]) rba[r.asset_id]=[];  rba[r.asset_id].push(r); });
  const findR = (...pats) => {
    for (const r of readings) {
      if (pats.some(p => r.question_name.toLowerCase().includes(p.toLowerCase()))) return r;
    }
    return null;
  };

  // Shared: recent breakdown timeline used by several disciplines
  const breakdownTimeline = breakdownAssets.slice(0,3).map(a=>(
    <TlItem key={`bd-${a.id}`} type="crit"
      date={`#${a.asset_number||a.id}`}
      title={`${a.name} — Breakdown`}
      desc={`Location: ${a.location||"—"}`} />
  ));
  const noIssues = (
    <div style={{ textAlign:"center",color:"#059669",padding:"14px 0",fontSize:12 }}>✅ No active issues</div>
  );

  // Shared: AMC status rows used by most disciplines in summary card
  const amcRows = (
    <div style={{ marginTop:12 }}>
      <div style={{ fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.dim,marginBottom:8 }}>AMC Status</div>
      {[
        { label:"Active AMC",    value:(catSummary.amc_total||0)-(catSummary.amc_expired||0)-(catSummary.amc_expiring||0), col:"#059669" },
        { label:"Expiring (30d)",value:catSummary.amc_expiring||0, col:"#d97706" },
        { label:"Expired",       value:catSummary.amc_expired||0,  col:"#dc2626" },
      ].map(b=>(
        <div key={b.label} style={{ display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11 }}>
          <span style={{ color:C.muted }}>{b.label}</span>
          <span className="fos-font-mono" style={{ color:b.col }}>{b.value}</span>
        </div>
      ))}
    </div>
  );

  // ── HVAC ──
  if (disc==="hvac") {
    const kwh  = findR("kwh","energy","kw","power");
    const temp = findR("temperature","temp","degree");
    return (
      <>
        <Card title="Recent History">
          {breakdownAssets.length>0 ? breakdownTimeline : noIssues}
          {criticalAssets.filter(a=>!a.breakdown).slice(0,2).map(a=>(
            <TlItem key={`cr-${a.id}`} type="warn"
              date={`#${a.asset_number||a.id}`}
              title={`${a.name} — Critical`}
              desc={`Location: ${a.location||"—"}`} />
          ))}
          {readings.slice(0,3).map((r,i)=>(
            <TlItem key={`rd-${i}`} type="info"
              date={r.recorded_at||"—"}
              title={r.question_name}
              desc={`Reading: ${r.value}${r.unit_label?" "+r.unit_label:""}`} />
          ))}
        </Card>
        <Card title="Cost Summary (MTD)">
          {[
            { label:"Energy",      value:kwh?`${kwh.value} ${kwh.unit_label||"kWh"}`:"—", col:"#4f46e5" },
            { label:"Ambient Temp",value:temp?`${temp.value}°C`:"—", col:"#d97706" },
          ].map(b=>(
            <div key={b.label} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12 }}>
              <span style={{ color:C.muted }}>{b.label}</span>
              <span className="fos-font-mono" style={{ color:b.col }}>{b.value}</span>
            </div>
          ))}
          <div style={{ marginTop:8,padding:"7px 10px",background:C.card2,borderRadius:6,fontSize:10,color:"#6b7280",fontStyle:"italic" }}>
            ℹ️ Cost (₹) data requires billing module integration
          </div>
          {amcRows}
        </Card>
      </>
    );
  }

  // ── DG ──
  if (disc==="dg") {
    const lastTestR = findR("test run","load test","weekly test");
    return (
      <>
        <Card title="Test Run History">
          {lastTestR
            ? <TlItem type="ok" date={lastTestR.recorded_at||"—"} title="Load Test Completed" desc={`Result: ${lastTestR.value}`} />
            : <div style={{ color:C.dim,fontSize:11,fontStyle:"italic",padding:"8px 0" }}>No test run records found.<br/>Tag "test run" questions as numeric to capture here.</div>
          }
          {breakdownAssets.length>0 ? breakdownTimeline : noIssues}
        </Card>
        <Card title="Fuel & Runtime Summary">
          <ProgBar label="Operational Units" value={totalCnt>0?(operCnt/totalCnt)*100:0} color="#34d399" />
          <ProgBar label="On Breakdown"       value={totalCnt>0?((drillSummary.breakdown_count||0)/totalCnt)*100:0} color="#f87171" />
          {records.slice(0,4).map(a=>{
            const fuel = (rba[a.id]||[]).find(r=>["fuel","diesel"].some(k=>r.question_name.toLowerCase().includes(k)));
            if (!fuel) return null;
            const fp = parseFloat(fuel.value)||0;
            return <ProgBar key={a.id} label={a.name.length>20?a.name.slice(0,18)+"…":a.name} value={fp} color={fp>=60?"#34d399":fp>=30?"#facc15":"#f87171"} labelRight={`${fp}%`} />;
          })}
          {amcRows}
        </Card>
      </>
    );
  }

  // ── Elevators ──
  if (disc==="elev") {
    return (
      <>
        <Card title="Entrapment & Breakdown History">
          {breakdownAssets.length>0 ? breakdownTimeline : noIssues}
          {criticalAssets.filter(a=>!a.breakdown).slice(0,2).map(a=>(
            <TlItem key={`cr-${a.id}`} type="warn"
              date={`#${a.asset_number||a.id}`}
              title={`${a.name}`}
              desc={`Location: ${a.location||"—"} · Critical status`} />
          ))}
        </Card>
        <Card title="MTBF / MTTR Summary">
          {[
            { label:"MTBF (hrs)",   value:"—", col:C.muted },
            { label:"MTTR (hrs)",   value:"—", col:C.muted },
            { label:"Entrapments",  value:breakdownAssets.filter(a=>a.name.toLowerCase().includes("entrap")).length||0, col:"#34d399" },
            { label:"Complaints",   value:"—", col:C.muted },
          ].map(b=>(
            <div key={b.label} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12 }}>
              <span style={{ color:C.muted }}>{b.label}</span>
              <span className="fos-font-mono" style={{ color:b.col }}>{b.value}</span>
            </div>
          ))}
          <div style={{ marginTop:8,padding:"7px 10px",background:C.card2,borderRadius:6,fontSize:10,color:"#6b7280",fontStyle:"italic" }}>
            ℹ️ MTBF/MTTR require breakdown_events Phase 2 integration
          </div>
          {amcRows}
        </Card>
      </>
    );
  }

  // ── Fire & Safety ──
  if (disc==="fire") {
    const lastInsp = findR("inspection","noc","check","drill");
    return (
      <>
        <Card title="Inspection & Compliance Events">
          {lastInsp
            ? <TlItem type="ok" date={lastInsp.recorded_at||"—"} title={lastInsp.question_name} desc={`Result: ${lastInsp.value}`} />
            : null
          }
          {breakdownAssets.length>0 ? breakdownTimeline : noIssues}
          {criticalAssets.filter(a=>!a.breakdown).slice(0,2).map(a=>(
            <TlItem key={`cr-${a.id}`} type="warn"
              date={`#${a.asset_number||a.id}`}
              title={a.name}
              desc={`Location: ${a.location||"—"}`} />
          ))}
        </Card>
        <Card title="Compliance Status">
          {[
            { label:"NOC / Form C",          value:"—", col:C.dim },
            { label:"Mock Drill Compliance",  value:"—", col:C.dim },
            { label:"Extinguisher Check",     value:"—", col:C.dim },
            { label:"Sprinkler Test",         value:"—", col:C.dim },
          ].map(b=>(
            <div key={b.label} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12 }}>
              <span style={{ color:C.muted }}>{b.label}</span>
              <span className="fos-font-mono" style={{ color:b.col }}>{b.value}</span>
            </div>
          ))}
          <div style={{ marginTop:8,padding:"7px 10px",background:C.card2,borderRadius:6,fontSize:10,color:"#6b7280",fontStyle:"italic" }}>
            ℹ️ Tag compliance questions with field_type=scored to capture here
          </div>
          {amcRows}
        </Card>
      </>
    );
  }

  // ── UPS & Power ──
  if (disc==="ups") {
    const loadR = findR("load","output","kwh");
    return (
      <>
        <Card title="Power Events">
          {readings.slice(0,4).map((r,i)=>(
            <TlItem key={`rd-${i}`} type="info"
              date={r.recorded_at||"—"}
              title={r.question_name}
              desc={`Reading: ${r.value}${r.unit_label?" "+r.unit_label:""}`} />
          ))}
          {readings.length===0 && breakdownAssets.length===0 && noIssues}
          {breakdownTimeline}
        </Card>
        <Card title="Load & Battery Summary">
          <ProgBar label="Operational" value={totalCnt>0?(operCnt/totalCnt)*100:0} color="#34d399" />
          {loadR && <ProgBar label={`${loadR.question_name}`} value={parseFloat(loadR.value)||0} color="#facc15" labelRight={`${loadR.value}${loadR.unit_label?" "+loadR.unit_label:""}`} />}
          <div style={{ marginTop:8,padding:"7px 10px",background:C.card2,borderRadius:6,fontSize:10,color:"#6b7280",fontStyle:"italic" }}>
            ℹ️ kVA capacity and inverter efficiency require Phase 2 integration
          </div>
          {amcRows}
        </Card>
      </>
    );
  }

  // ── Water & Plumbing ──
  if (disc==="water") {
    const tds = findR("tds","total dissolved");
    const ph  = findR("ph","acidity");
    return (
      <>
        <Card title="Water Quality Events">
          {tds && <TlItem type={parseFloat(tds.value)>500?"warn":"ok"} date={tds.recorded_at||"—"} title="TDS Reading" desc={`${tds.value} ppm${parseFloat(tds.value)>500?" — above threshold":""}`} />}
          {ph  && <TlItem type={parseFloat(ph.value)<6.5||parseFloat(ph.value)>8.5?"warn":"ok"} date={ph.recorded_at||"—"} title="pH Reading" desc={`pH ${ph.value}${(parseFloat(ph.value)<6.5||parseFloat(ph.value)>8.5)?" — out of range":""}`} />}
          {readings.length===0 && noIssues}
          {breakdownTimeline}
        </Card>
        <Card title="Water System Summary">
          <ProgBar label="Pumps Operational" value={totalCnt>0?(operCnt/totalCnt)*100:0} color="#34d399" />
          <ProgBar label="On Breakdown"       value={totalCnt>0?((drillSummary.breakdown_count||0)/totalCnt)*100:0} color="#f87171" />
          {[
            { label:"TDS (target ≤500)",    value:tds?`${tds.value} ppm`:"—", col:tds&&parseFloat(tds.value)>500?"#f87171":"#34d399" },
            { label:"pH (target 6.5–8.5)",  value:ph?`pH ${ph.value}`:"—",   col:ph&&(parseFloat(ph.value)<6.5||parseFloat(ph.value)>8.5)?"#f87171":"#34d399" },
          ].map(b=>(
            <div key={b.label} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:11,marginTop:4 }}>
              <span style={{ color:C.muted }}>{b.label}</span>
              <span className="fos-font-mono" style={{ color:b.col }}>{b.value}</span>
            </div>
          ))}
          {amcRows}
        </Card>
      </>
    );
  }

  // ── General fallback ──
  return (
    <>
      <Card title={`Recent Events${readings.length>0?" & Readings":""}`}>
        {breakdownAssets.length>0 ? breakdownTimeline : noIssues}
        {criticalAssets.filter(a=>!a.breakdown).slice(0,1).map(a=>(
          <TlItem key={`cr-${a.id}`} type="warn"
            date={`#${a.asset_number||a.id}`}
            title={`${a.name} — Critical`}
            desc={`Location: ${a.location||"—"}`} />
        ))}
        {readings.slice(0,3).map((r,i)=>(
          <TlItem key={`rd-${i}`} type="info"
            date={r.recorded_at||"—"}
            title={r.question_name}
            desc={`Reading: ${r.value}${r.unit_label?" "+r.unit_label:""}`} />
        ))}
      </Card>
      <Card title="Maintenance Summary">
        <ProgBar label="Operational" value={totalCnt>0?(operCnt/totalCnt)*100:0} color="#34d399" />
        <ProgBar label="Breakdown"   value={totalCnt>0?((drillSummary.breakdown_count||catSummary.breakdown_count||0)/totalCnt)*100:0} color="#f87171" />
        <ProgBar label="Maintenance" value={totalCnt>0?((drillSummary.maintenance||0)/totalCnt)*100:0} color="#facc15" />
        {amcRows}
      </Card>
    </>
  );
};

// ── Overview Page ─────────────────────────────────────────────────────────────
const OverviewPage = ({ data, loading, onSelectCat }) => {
  const cats = data?.category_breakdown || [];
  const s = data?.summary || {};
  const fhi = computeFHI(cats);
  const fhiCol = fhi>=75?"#059669":fhi>=50?"#d97706":"#dc2626";
  const criticalAssets = data?.critical_assets || [];

  const discMap = {};
  cats.forEach(c => {
    const d = getDisc(c.category, c.discipline);
    if (!discMap[d]) discMap[d] = { score:c.health_percentage, categories:[c.category] };
    else { discMap[d].categories.push(c.category); discMap[d].score = Math.round((discMap[d].score+c.health_percentage)/2); }
  });

  const FHI_ROWS = [
    { disc:"hvac",  label:"HVAC", weight:"30%" },
    { disc:"dg",    label:"DG / Generator", weight:"20%" },
    { disc:"fire",  label:"Fire & Safety", weight:"20%" },
    { disc:"elev",  label:"Elevators", weight:"15%" },
    { disc:"ups",   label:"UPS & Electrical", weight:"10%" },
    { disc:"water", label:"Water & Plumbing", weight:"5%" },
  ].filter(r => discMap[r.disc]);

  // Alert bars from real data
  const critAlerts = criticalAssets.filter(a=>a.breakdown).slice(0,2);
  const warnAlerts = criticalAssets.filter(a=>!a.breakdown).slice(0,1);
  const amcAlerts  = cats.filter(c=>(c.amc_expired||0)>0).slice(0,1);

  return (
    <div className="fos-reveal">
      {/* Alert bars */}
      {critAlerts.map(a=>(
        <AlertBar key={a.id} type="crit">
          🔴 <strong>{a.name}</strong> · {a.category} · {a.location||"—"} · Active breakdown — immediate attention required
        </AlertBar>
      ))}
      {warnAlerts.map(a=>(
        <AlertBar key={a.id} type="warn">
          ⚠️ <strong>{a.name}</strong> · {a.category} · {a.location||"—"} · Critical status
        </AlertBar>
      ))}
      {amcAlerts.map(c=>(
        <AlertBar key={c.category} type="warn">
          ⚠️ {c.amc_expired} AMC contract{c.amc_expired>1?"s":""} expired in <strong>{c.category}</strong> — renewal required
        </AlertBar>
      ))}
      {criticalAssets.length===0 && !loading && (
        <AlertBar type="info">✅ No critical alerts — all systems nominal</AlertBar>
      )}

      {/* Page header */}
      <div style={{ marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10 }}>
        <div>
          <div className="fos-font-display" style={{ fontSize:28,letterSpacing:2,color:C.text }}>FACILITY ASSET OVERVIEW</div>
          <div style={{ fontSize:13,color:C.muted,marginTop:2 }}>
            {getItemInLocalStorage("SITENAME")||"Facility"} · {cats.length} disciplines · Real-time monitoring
          </div>
        </div>
        <div className="fos-font-mono" style={{ fontSize:11,color:C.dim }}>
          FHI · Formula: HVAC×30 + DG×20 + Fire×20 + Lift×15 + UPS×10 + Water×5
        </div>
      </div>

      {/* FHI card */}
      <Card style={{ marginBottom:16 }} title="Facility Health Index">
        <div style={{ display:"flex",alignItems:"flex-start",gap:32,flexWrap:"wrap" }}>
          {/* Big FHI score */}
          <div style={{ minWidth:130 }}>
            <div className="fos-font-display" style={{ fontSize:72,lineHeight:1,color:fhiCol }}>{loading?"—":fhi.toFixed(0)}</div>
            <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>
              / 100 &nbsp;·&nbsp; <span style={{ color:fhiCol,fontWeight:600 }}>{scoreLabel(fhi)}</span>
            </div>
          </div>

          {/* Per-discipline progress bars */}
          <div style={{ flex:1,minWidth:260 }}>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.dim,marginBottom:10 }}>Per-Discipline Scores</div>
            {loading
              ? [1,2,3,4].map(i=><div key={i} style={{ height:20,background:C.card2,borderRadius:4,marginBottom:10 }} />)
              : (FHI_ROWS.length>0 ? FHI_ROWS : cats.map(c=>({ disc:getDisc(c.category,c.discipline),label:c.category }))).map(r=>{
                  const sc = discMap[r.disc]?.score ?? 0;
                  return <ProgBar key={r.disc||r.label} label={`${CAT_ICON[r.disc]||"⚙️"} ${r.label}${r.weight?" ("+r.weight+")":""}`} value={sc} />;
                })
            }
          </div>

          {/* 4 stat boxes */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,minWidth:190 }}>
            {[
              { label:"Assets Online",   value:s.operational??'—', color:"#34d399" },
              { label:"Critical Issues", value:(s.critical??0)+(s.offline??0), color:(s.critical||0)+(s.offline||0)>0?"#f87171":"#34d399" },
              { label:"Maintenance",     value:s.maintenance??'—', color:s.maintenance>0?"#facc15":"#34d399" },
              { label:"Total Assets",    value:s.total??'—',       color:C.muted },
            ].map(item=>(
              <div key={item.label} style={{ textAlign:"center",background:C.card2,borderRadius:8,padding:12 }}>
                <div className="fos-font-mono" style={{ fontSize:24,color:item.color }}>{loading?"—":item.value}</div>
                <div style={{ fontSize:9,color:C.dim,marginTop:3,textTransform:"uppercase",letterSpacing:".5px" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Category overview cards — 3-column grid (like reference) */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.dim,marginBottom:12 }}>
          Asset Categories — click to drill into system dashboard
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {loading
            ? Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{ height:185,background:C.card,borderRadius:10,border:`1px solid ${C.border}` }} />
              ))
            : cats.map(cat=>{
                const disc = getDisc(cat.category, cat.discipline);
                const pct  = cat.health_percentage||0;
                const st   = pct>=75?"ok":pct>=50?"warn":"crit";
                const stCol= st==="ok"?"#34d399":st==="warn"?"#facc15":"#f87171";
                const stLbl= cat.breakdown_count>0?`${cat.breakdown_count} Breakdown${cat.breakdown_count>1?"s":""}`:st==="ok"?"All Running":`${(cat.total||0)-(cat.operational||0)} Issues`;
                const amcIssue = (cat.amc_expired||0)+(cat.amc_expiring||0);
                return (
                  <div key={cat.category}
                    onClick={()=>onSelectCat(cat.category)}
                    style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.bord2;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.4)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}
                  >
                    {/* Corner icon */}
                    <div style={{ position:"absolute",right:12,top:12,fontSize:38,opacity:.07,lineHeight:1,userSelect:"none" }}>{CAT_ICON[disc]||"⚙️"}</div>
                    {/* Top accent bar */}
                    <div style={{ height:3,background:"#3b82f6",borderRadius:2,marginBottom:14 }} />
                    {/* Header row */}
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
                      <div>
                        <div className="fos-font-display" style={{ fontSize:18,letterSpacing:"1.5px",color:C.text }}>{cat.category.toUpperCase()}</div>
                        <div style={{ fontSize:11,color:C.muted }}>{cat.total} assets · {CAT_ICON[disc]} {disc.toUpperCase()}</div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600 }}>
                        <Dot st={st} />
                        <span style={{ color:stCol }}>{stLbl}</span>
                      </div>
                    </div>
                    {/* 4 KPI mini-boxes */}
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:7 }}>
                      <div style={{ background:C.card2,borderRadius:6,padding:"7px 9px" }}>
                        <div style={{ fontSize:8,color:C.dim,textTransform:"uppercase",letterSpacing:".6px",marginBottom:2 }}>Availability</div>
                        <div className="fos-font-mono" style={{ fontSize:14,fontWeight:600,color:stCol }}>{pct.toFixed(1)}%</div>
                      </div>
                      <div style={{ background:C.card2,borderRadius:6,padding:"7px 9px" }}>
                        <div style={{ fontSize:8,color:C.dim,textTransform:"uppercase",letterSpacing:".6px",marginBottom:2 }}>Breakdowns</div>
                        <div className="fos-font-mono" style={{ fontSize:14,fontWeight:600,color:cat.breakdown_count>0?"#f87171":"#34d399" }}>{cat.breakdown_count||0}</div>
                      </div>
                      <div style={{ background:C.card2,borderRadius:6,padding:"7px 9px" }}>
                        <div style={{ fontSize:8,color:C.dim,textTransform:"uppercase",letterSpacing:".6px",marginBottom:2 }}>Operational</div>
                        <div className="fos-font-mono" style={{ fontSize:14,fontWeight:600,color:C.text }}>{cat.operational||0}/{cat.total||0}</div>
                      </div>
                      <div style={{ background:C.card2,borderRadius:6,padding:"7px 9px" }}>
                        <div style={{ fontSize:8,color:C.dim,textTransform:"uppercase",letterSpacing:".6px",marginBottom:2 }}>AMC Issues</div>
                        <div className="fos-font-mono" style={{ fontSize:14,fontWeight:600,color:amcIssue>0?"#facc15":"#34d399" }}>{amcIssue>0?amcIssue:"✓"}</div>
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>

      {/* Cross-system asset register table */}
      <Card title={`Asset Flag Register${criticalAssets.length>0?" · "+criticalAssets.length+" flagged":""}`}>
        {criticalAssets.length===0 && !loading
          ? <div style={{ textAlign:"center",color:C.dim,padding:"20px 0",fontSize:13 }}>✅ No assets flagged — all systems nominal</div>
          : <Table
              heads={["Asset","Asset #","System","Location","Issue Type","Priority","Status"]}
              rows={criticalAssets.map(a=>{
                const priority = a.breakdown ? "High" : "Medium";
                const issueType = a.breakdown ? "Breakdown" : "Critical Status";
                return (
                  <tr key={a.id} style={{ borderBottom:`1px solid ${C.border}` }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.018)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 12px",color:C.text,fontWeight:600 }}>{a.name}</td>
                    <td style={{ padding:"10px 12px",color:C.muted,fontFamily:"'IBM Plex Mono',monospace",fontSize:10 }}>{a.asset_number||'—'}</td>
                    <td style={{ padding:"10px 12px",color:"#3b82f6",fontSize:12 }}>{a.category||'—'}</td>
                    <td style={{ padding:"10px 12px",color:C.muted,fontSize:12 }}>{a.location||'—'}</td>
                    <td style={{ padding:"10px 12px" }}><Badge type={a.breakdown?"crit":"warn"}>{issueType}</Badge></td>
                    <td style={{ padding:"10px 12px" }}><Badge type={priority==="High"?"crit":"warn"}>{priority}</Badge></td>
                    <td style={{ padding:"10px 12px" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                        <Dot st={a.breakdown?"crit":"warn"} />
                        <span style={{ fontSize:11,color:a.breakdown?"#f87171":"#facc15" }}>{a.breakdown?"Breakdown":"Critical"}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            />
        }
      </Card>
    </div>
  );
};

// ── Level 2 — Category Detail ─────────────────────────────────────────────────
const CategoryPage = ({ category, portfolioData }) => {
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);

  const catSummary = portfolioData?.category_breakdown?.find(c=>c.category===category)||{};
  // catSummary.discipline is the DB-set override; falls back to keyword detection
  const disc = getDisc(category, catSummary.discipline);
  const scoreRows = SCORECARD_DEF[disc] || SCORECARD_DEF.ups;

  useEffect(()=>{
    setLoading(true); setAssets(null);
    dashboardApi.get("/api/v1/grouped_dashboard/system_health.json",{params:{category}})
      .then(r=>setAssets(r.data)).catch(()=>setAssets(null)).finally(()=>setLoading(false));
  },[category]);

  const drillSummary = assets?.summary||{};
  const records = assets?.records||[];

  // Real kpi_values from API (keyed by asset_id → kpi_key → {value,unit})
  // Merge with computed fallback values
  const apiKpiValues = assets?.kpi_values || {};
  const kpiValues = {
    ...buildKpiValues(catSummary, records),
    // Real data from API overrides estimates
    availability:     drillSummary.availability     ?? undefined,
    mtbf:             drillSummary.mtbf_hrs         ?? undefined,
    mttr:             drillSummary.mttr_hrs         ?? undefined,
    health_pct:       drillSummary.health_score_avg ?? undefined,
    pm_compliance:    drillSummary.pm_compliance    ?? undefined,
    breakdown_count:  drillSummary.breakdown_count_mtd ?? undefined,
  };

  // Build per-asset reading lookup: prefer kpi_key map from API, fallback to latest_readings
  const readingByAsset = {};
  // First pass: from latest_readings (question_name based — backwards compat)
  (assets?.latest_readings||[]).forEach(r => {
    if (!readingByAsset[r.asset_id]) readingByAsset[r.asset_id] = [];
    readingByAsset[r.asset_id].push(r);
  });
  // Second pass: inject kpi_key readings from kpi_values API map
  Object.entries(apiKpiValues).forEach(([assetId, kpiMap]) => {
    const aid = parseInt(assetId, 10);
    if (!readingByAsset[aid]) readingByAsset[aid] = [];
    Object.entries(kpiMap).forEach(([kpiKey, data]) => {
      if (!readingByAsset[aid].find(r => r.kpi_key === kpiKey)) {
        readingByAsset[aid].push({
          asset_id:      aid,
          question_name: kpiKey,
          kpi_key:       kpiKey,
          value:         data.value,
          unit_label:    data.unit,
          recorded_at:   data.recorded_at,
        });
      }
    });
  });

  // Build flat list of all readings across all assets for KPI tile generation
  const allReadings = Object.values(readingByAsset).flat();
  const pct = catSummary.health_percentage||drillSummary.health_percentage||0;
  const hcol = pct>=75?"#059669":pct>=50?"#d97706":"#dc2626";

  const getKpiStatus = (key, val) => {
    if (!val || val==="—") return undefined;
    const num = parseFloat(val);
    if (isNaN(num)) return undefined;
    if (key==="availability"||key==="health_pct") return num>=90?"ok":num>=70?"warn":"crit";
    if (key==="breakdown_count") return num===0?"ok":num<=2?"warn":"crit";
    return undefined;
  };

  const getScoreGrade = (key, val) => {
    if (!val||val==="—") return "na";
    const num = parseFloat(val);
    if (isNaN(num)) return "na";
    if (key==="breakdown_count"||key==="entrapments"||key==="alarm_count") return num===0?"ok":num<=2?"warn":"crit";
    return num>=90?"ok":num>=70?"warn":"crit";
  };

  const alertType = (drillSummary.critical>0||drillSummary.offline>0)?"crit":drillSummary.maintenance>0?"warn":"info";
  const alertMsg  = alertType==="crit"
    ? `🔴 ${(drillSummary.critical||0)+(drillSummary.offline||0)} asset(s) critical/offline — immediate attention required`
    : alertType==="warn"
    ? `⚠️ ${drillSummary.maintenance||0} asset(s) under maintenance`
    : `✅ All ${category} assets operating normally`;

  const breakdownAssets = records.filter(a=>a.breakdown===true||a.breakdown===1);
  const criticalAssets  = records.filter(a=>a.critical===true||a.critical===1);
  const totalCnt = drillSummary.total || catSummary.total || 0;
  const operCnt  = drillSummary.operational || catSummary.operational || 0;

  return (
    <div className="fos-reveal">
      {/* L2 header */}
      <div style={{ marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10 }}>
        <div>
          <div className="fos-font-display" style={{ fontSize:28,letterSpacing:2,color:C.text }}>
            {CAT_ICON[disc]||"⚙️"} {category.toUpperCase()} — SYSTEM DASHBOARD
          </div>
          <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>
            Level 2 · {totalCnt} assets · Health: <span style={{ color:hcol }}>{pct.toFixed(0)}% ({scoreLabel(pct)})</span>
          </div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <Badge type={pct>=75?"ok":pct>=50?"warn":"crit"}>Health {pct.toFixed(0)}%</Badge>
          <Badge type={operCnt<totalCnt?"warn":"ok"}>{operCnt}/{totalCnt} Online</Badge>
          <div style={{ display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:4,background:"rgba(59,130,246,.1)",border:"1px solid rgba(59,130,246,.2)",color:"#3b82f6",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:1 }}>
            {category.slice(0,3).toUpperCase()}-SYS
          </div>
        </div>
      </div>

      <AlertBar type={alertType}>{alertMsg}</AlertBar>

      {/* KPI tiles — 2 fixed operational + dynamic readings from checklist config */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16 }}>
        {buildKpiTiles(kpiValues, allReadings, disc).map((k, i) => {
          let val, st;
          if (k.value !== undefined) {
            // Dynamic reading tile — value comes directly from reading
            val = k.value != null ? `${k.value}${k.unit ? " "+k.unit : ""}` : "—";
            st  = undefined;
          } else {
            val = kpiValues[k.key] ?? null;
            st  = getKpiStatus(k.key, val);
          }
          return <KpiTile key={k.key+i} label={k.label} value={val??'—'} sub={k.sub} status={st} na={k.na} loading={loading&&!k.na} />;
        })}
      </div>

      {/* 2-column: asset table (wider) + discipline right panel */}
      <div style={{ display:"grid",gridTemplateColumns:"1.45fr 1fr",gap:14,marginBottom:14,alignItems:"start" }}>
        {/* Asset Health Monitor table */}
        <Card title={`${category} — Asset Health Monitor (${records.length} assets)`}>
          {loading
            ? <div style={{ height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.dim }}>Loading assets…</div>
            : records.length===0
            ? <div style={{ textAlign:"center",color:C.dim,padding:"24px 0",fontSize:13 }}>No assets found for this category.</div>
            : <DynamicAssetTable records={records.slice(0,15)} readingByAsset={readingByAsset} />
          }
          {records.length>15 && <div style={{ textAlign:"center",fontSize:11,color:C.dim,marginTop:8 }}>Showing 15 of {records.length} assets</div>}
        </Card>

        {/* Discipline-specific right panel with real sensor readings */}
        <DiscPanel disc={disc} records={records} drillSummary={drillSummary} catSummary={catSummary} readings={assets?.latest_readings||[]} />
      </div>

      {/* 3-column bottom section */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
        {/* KPI Scorecard */}
        <Card title="KPI Scorecard">
          <Table
            heads={["KPI","Target","Actual","Grade"]}
            rows={scoreRows.map(r=>{
              const val = kpiValues[r.key];
              const grade = getScoreGrade(r.key, val);
              return (
                <tr key={r.kpi} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:"7px 10px",color:C.muted,fontSize:11.5 }}>{r.kpi}</td>
                  <td style={{ padding:"7px 10px",color:C.dim,fontSize:10 }}>{r.target}</td>
                  <td style={{ padding:"7px 10px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11.5,color:grade==="na"?C.dim:grade==="ok"?"#34d399":grade==="warn"?"#facc15":"#f87171" }}>
                    {val||'—'}
                  </td>
                  <td style={{ padding:"7px 10px" }}>
                    <Badge type={grade==="na"?"na":grade}>{grade==="na"?"N/A":grade==="ok"?"OK":grade==="warn"?"Watch":"Fail"}</Badge>
                  </td>
                </tr>
              );
            })}
          />
        </Card>

        <DiscBottomCards
          disc={disc}
          records={records}
          drillSummary={drillSummary}
          catSummary={catSummary}
          readings={assets?.latest_readings||[]}
          breakdownAssets={breakdownAssets}
          criticalAssets={criticalAssets}
          totalCnt={totalCnt}
          operCnt={operCnt}
        />
      </div>
    </div>
  );
};

// ── Tab Button ────────────────────────────────────────────────────────────────
const TabBtn = ({ label, active, onClick }) => (
  <button onClick={onClick}
    style={{ padding:"5px 13px",fontSize:12,fontWeight:600,borderRadius:6,cursor:"pointer",fontFamily:"'Outfit',sans-serif",letterSpacing:".4px",whiteSpace:"nowrap",transition:"all .18s",background:active?"rgba(255,255,255,.25)":"transparent",color:"#ffffff",border:active?"1px solid rgba(255,255,255,.4)":"1px solid transparent" }}
    onMouseEnter={e=>{ if(!active){e.currentTarget.style.background="rgba(255,255,255,.12)";e.currentTarget.style.borderColor="rgba(255,255,255,.2)";} }}
    onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent";} }}
  >{label}</button>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const GroupedDashboardPage = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const token  = getItemInLocalStorage("TOKEN");
  const siteId = getItemInLocalStorage("SITEID"); // used only for UI warning below

  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [clock,     setClock]     = useState(new Date());

  useEffect(()=>{ const t=setInterval(()=>setClock(new Date()),1000); return ()=>clearInterval(t); },[]);

  const fetchData = useCallback(async()=>{
    setLoading(true); setError(null);
    try {
      const r = await dashboardApi.get("/api/v1/grouped_dashboard/facility_health_index.json");
      setData(r.data);
    } catch(e) {
      setError(e?.response?.data?.error||e.message||"Failed to load data");
    } finally { setLoading(false); }
  },[]);

  useEffect(()=>{ fetchData(); },[fetchData]);

  const cats = data?.category_breakdown||[];

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden">
        {/* Top header — matches app theme colour */}
        <header className="px-3 sm:px-5 pt-3 sticky top-0 z-50">
          <div style={{ background:themeColor }} className="w-full rounded-2xl px-4 py-2 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
            <h1 className="text-white font-semibold text-base sm:text-lg whitespace-nowrap">
              Asset Dashboard
            </h1>
            <div style={{ display:"flex",gap:4,flexWrap:"wrap",flex:1,justifyContent:"center" }}>
              <TabBtn label="🏢 Overview" active={activeTab==="overview"} onClick={()=>setActiveTab("overview")} />
              {cats.map(c=>(
                <TabBtn key={c.category} label={`${catIcon(c.category)} ${c.category}`} active={activeTab===c.category} onClick={()=>setActiveTab(c.category)} />
              ))}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
              <div style={{ display:"flex",alignItems:"center",gap:5,fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"rgba(255,255,255,.9)" }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:"#34d399",display:"inline-block" }} className="fos-pulse-green" />
                LIVE
              </div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"rgba(255,255,255,.8)" }}>{clock.toTimeString().slice(0,8)}</div>
              <button onClick={fetchData} disabled={loading} style={{ background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:6,padding:"4px 10px",color:"#ffffff",cursor:"pointer",fontSize:11 }}>
                {loading?"…":"↻"}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div style={{ margin:"12px 22px",padding:"10px 14px",background:"rgba(220,38,38,.08)",border:"1px solid rgba(220,38,38,.22)",borderRadius:7,color:"#dc2626",fontSize:12,display:"flex",gap:10,alignItems:"center" }}>
            🔴 {error}
            <button onClick={fetchData} style={{ background:"none",border:"none",color:"#dc2626",textDecoration:"underline",cursor:"pointer",fontSize:12 }}>Retry</button>
            {!token && <span style={{ color:"#d97706" }}>· Not logged in</span>}
          </div>
        )}

        <div className="fos-root" style={{ minHeight:"auto",background:"transparent" }}>
          <div style={{ padding:"22px",position:"relative",zIndex:1 }}>
            {activeTab==="overview"
              ? <OverviewPage data={data} loading={loading} onSelectCat={setActiveTab} />
              : <CategoryPage key={activeTab} category={activeTab} portfolioData={data} />
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupedDashboardPage;
