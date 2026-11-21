(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const isViewer=new URLSearchParams(location.search).has("viewer");
const steps=["Alarmierung","Einsatzobjekt","Lageentwicklung","Planspiel"];
const kinds=[["fahrzeug","Fahrzeug","Fw"],["bereitstellung","Bereitstellungsraum","BR"],["wasser","Wasserentnahme","WE"],["leitung","Einsatzleitung","EL"],["abschnitt","Einsatzabschnitt","EA"],["brand","Brand","F"],["rauch","Rauch","R"],["person","Person","P"],["verletzt","Verletzte Person","V"],["vermisst","Vermisste Person","?"],["gerettet","Gerettete Person","G"],["tot","Tote Person","†"],["gefahr","Akute Gefahr","!"],["vu","Verkehrsunfall","VU"]];
const tacticCatalog={
 fw:{name:"Feuerwehr",color:"#d4202b",categories:{
  "Löschfahrzeuge":["LF 20","LF 10","LF 8","LF-KatS","HLF 20","HLF 10","MLF","TSF","TSF-W"],
  "Tanklöschfahrzeuge":["TLF 4000","TLF 3000","TLF 2000","StLF 20/25","StLF 20","StLF 10"],
  "Hubrettungsfahrzeuge":["DLK 23","DLK 18","DLK 12","TM 32","GM 30"],
  "Rüst- und Gerätewagen":["RW","RW 1","GW-L1","GW-L2","GW-G","GW-A","GW-Mess"],
  "Führung / Transport":["ELW 1","ELW 2","KdoW","MTF","MTW"],
  "Weitere Fahrzeuge":["WLF","AB-Logistik","AB-Atemschutz","SW 2000","GW-T","FLF","MZF"],
  "Einsatzarten":["Feuer/Brandstelle","Verkehrsunfall","VU mit LKW","Zugunglück","Flugzeugunglück","Gefahrgutunfall","Gebäudeeinsturz","Wassernotstand","Person in Notlage","Tier in Notlage"],
  "Wasserversorgung":["Hydrant","Tiefbrunnen","Wasserentnahmestelle","Wasserbehälter","Pumpenstandort"],
  "Führung / Personen":["Einsatzleitung","Bereitstellungsraum","Einsatzabschnitt","Vermisste Person","Verletzte Person","Gerettete Person"]
 }},
 rd:{name:"Rettungsdienst",color:"#fafafa",categories:{
  "Rettungsmittel":["RTW","NEF","NAW","KTW","KTW-B","NKTW","GRTW","ITW"],
  "Luftrettung":["RTH","ITH"],
  "Führung / Transport":["OrgL","LNA","ELW RD","GW-San","MTW RD"],
  "Patienten / Einsatzstellen":["Person in Notlage","Verletzte Person","Gerettete Person","Behandlungsplatz","Patientenablage"]
 }},
 thw:{name:"Technisches Hilfswerk",color:"#2867c9",categories:{
  "Bergung / Technik":["GKW","MzGW","MLW IV","LKW-K","Kipper","Radlader"],
  "Transport / Führung":["MTW OV","MTW TZ","FüKW","PKW OV"],
  "Fachgruppen":["FGr N","FGr WP","FGr Räumen","FGr Brückenbau"],
  "Schadenstellen":["Gebäudeeinsturz","Wassernotstand","Person in Notlage","Einsatzleitung"]
 }},
 pol:{name:"Polizei",color:"#286d53",categories:{
  "Einsatzfahrzeuge":["FuStW","MTW Polizei","GruKw","Befehlskraftwagen","Motorrad Polizei"],
  "Einsatzstellen":["Verkehrsunfall","VU mit LKW","Absperrung","Person in Notlage","Einsatzleitung"]
 }}
};
const tacticalKinds={
 "Feuer/Brandstelle":"brand","Verkehrsunfall":"vu","VU mit LKW":"vu_lkw","Zugunglück":"zug","Flugzeugunglück":"flugzeug",
 "Gefahrgutunfall":"gefahrgut","Gebäudeeinsturz":"einsturz","Wassernotstand":"wassergefahr",
 "Person in Notlage":"person","Tier in Notlage":"tier","Hydrant":"hydrant","Tiefbrunnen":"tiefbrunnen",
 "Wasserentnahmestelle":"wasser","Wasserbehälter":"wasserbehaelter","Pumpenstandort":"pumpe",
 "Einsatzleitung":"leitung","Bereitstellungsraum":"bereitstellung","Einsatzabschnitt":"abschnitt",
 "Vermisste Person":"vermisst","Verletzte Person":"verletzt","Gerettete Person":"gerettet",
 "Behandlungsplatz":"behandlungsplatz","Patientenablage":"patientenablage","Absperrung":"absperrung"
};
function orgColor(org){return tacticCatalog[org]?.color||"#d4202b"}
function tacticalVehicleSvg(type,org="fw",small=false){
 const color=orgColor(org),textColor=org==="rd"?"#132f43":"#fff",outline=org==="rd"?"#23384a":"#132938";
 const label=String(type||"FW").replace(/[^A-Za-z0-9äöüÄÖÜ /-]/g,"").slice(0,12);
 const rotor=/^(RTH|ITH)$/.test(String(type).trim().toUpperCase());
 if(rotor){const size=small?49:64;return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+Math.round(size*.78)+'" viewBox="0 0 72 56" aria-label="'+safe(type)+'"><ellipse cx="35" cy="22" rx="27" ry="7" fill="none" stroke="#1b3146" stroke-width="3"/><path d="M35 10v34M9 22h52" stroke="#15293d" stroke-width="2.5"/><path d="M22 35c0-8 6-13 13-13 8 0 13 6 13 13v7H22Z" fill="#f6f6f2" stroke="#142b43" stroke-width="2"/><path d="M48 36h15m-3-7v15" stroke="#203950" stroke-width="3"/><rect x="29" y="27" width="13" height="7" rx="2" fill="#9cb9ce"/><text x="35" y="40" font-size="8" text-anchor="middle" font-weight="800" fill="#ba2930">'+safe(type)+'</text></svg>'}
 const w=small?46:62,h=small?40:52;
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 68 54" role="img" aria-label="'+safe(label)+'">'+
 '<rect x="6" y="8" width="56" height="36" rx="2" fill="'+color+'" stroke="'+outline+'" stroke-width="2.3"/>'+
 '<path d="M6 13 62 40M6 40 62 13" stroke="'+(org==="rd"?"#637b8d":"#f4eff0")+'" stroke-opacity=".6" stroke-width="1.5"/>'+
 '<rect x="12" y="17" width="44" height="16" rx="2" fill="'+color+'" stroke="'+(org==="rd"?"#5f7480":textColor)+'" stroke-opacity=".45"/>'+
 '<text x="34" y="28.5" text-anchor="middle" font-size="'+(label.length>8?8.2:label.length>5?10:12)+'" font-weight="800" fill="'+textColor+'">'+safe(label)+'</text>'+
 '<circle cx="17" cy="47" r="4" fill="#fff" stroke="#172b3e" stroke-width="2"/><circle cx="51" cy="47" r="4" fill="#fff" stroke="#172b3e" stroke-width="2"/></svg>';
}
function tacticalSceneSvg(kind,label,small=false){
 const sz=small?40:48;
 const red=["brand","hydrant","tiefbrunnen","wasser","wasserbehaelter","pumpe"].includes(kind);
 const border=red?"#cf1f2c":"#111f2a",fill=red?"#fff2f2":"#fff";
 const code=({brand:"F",vu:"VU",vu_lkw:"LKW",zug:"ZUG",flugzeug:"FLG",gefahrgut:"GG",einsturz:"E",wassergefahr:"W",tier:"T",
 hydrant:"H",tiefbrunnen:"TB",wasser:"WE",wasserbehaelter:"WB",pumpe:"P",leitung:"EL",bereitstellung:"BR",abschnitt:"EA",
 person:"P",verletzt:"V",vermisst:"?",gerettet:"G",behandlungsplatz:"BHP",patientenablage:"PA",absperrung:"X"})[kind]||String(label||"?").slice(0,3);
 const round=["hydrant","tiefbrunnen","wasser","wasserbehaelter","pumpe"].includes(kind);
 const diamond=["person","verletzt","vermisst","gerettet"].includes(kind);
 let shape=round?'<circle cx="26" cy="24" r="19" fill="'+(red?"#d72a31":fill)+'" stroke="'+border+'" stroke-width="2"/>':
 diamond?'<path d="M26 4 46 24 26 44 6 24Z" fill="'+fill+'" stroke="'+border+'" stroke-width="2.5"/>':
 '<path d="M26 45 4 7H48Z" fill="'+fill+'" stroke="'+border+'" stroke-width="2.4"/>';
 if(kind==="brand")shape='<path d="M8 44 17 7 25 43 31 5 42 44Z" fill="#fff" stroke="#cf1624" stroke-width="2.7"/><path d="M19 41 22 22M33 40 34 22" stroke="#d51f2f" stroke-width="2.5"/>';
 const textFill=round?"#fff":border;
 return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 52 50" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+safe(label||kind)+'">'+shape+(kind==="brand"?"":'<text x="26" y="'+(round?29:diamond?29:27)+'" text-anchor="middle" font-size="'+(code.length>2?10:14)+'" font-weight="900" fill="'+textFill+'">'+safe(code)+'</text>')+'</svg>';
}
const initial=()=>({step:0,title:"",stichwort:"F 2",meldebild:"",address:"",date:new Date().toISOString().slice(0,10),time:"12:00",weather:"",temp:"",windDir:"",windSpeed:"",windUnit:"bft",visibility:"",vehicles:[{id:uid(),type:"LF 10",radio:"",crew:"0/1/8/9"}],imageUrl:"",imageSource:"",imageCredit:"",imageLat:null,imageLon:null,scene:"",versions:[],gallery:[],activeGalleryId:null,dynamic:true,cues:[],objects:[],journal:[],radioMessages:[],clock:0,clockBase:0,clockRunning:false,clockAnchor:null,started:false,ended:false,endedAt:null,cueSignal:null,mapCenter:[8.626,50.513],mapZoom:15,mapStyle:"osm",releaseFront:true,releaseMap:true,history:[],wildfires:[],hydrantsVisible:false,hydrants:[]});
let st=initial();try{const x=JSON.parse(localStorage.getItem("taktikplatte-wizard-v5")||"null");if(x){st={...initial(),...x};if(!x.windUnit&&x.windSpeed!==""&&x.windSpeed!=null){const kmh=Number(x.windSpeed);st.windSpeed=String([1,6,12,20,29,39,50,62,75,89,103,118].filter(v=>kmh>=v).length);st.windUnit="bft"}}}catch{}
let lastSeenCue=st.cueSignal?.id||null,flashTimer=null,participantChosenPhoto=null;let map=null,markers=[],hydrantMarkers=[],tool="",photos=[],photoIndex=0,activePanel="",startTime=0,timer=null,bc=null,geoloc=null;
try{bc=new BroadcastChannel("taktikplatte-wizard-v5")}catch{}
const bftLabel=v=>v===""||v==null?"–":String(v)+" Bft";
function migrateScenarioWind(x){if(!x.windUnit&&x.windSpeed!==""&&x.windSpeed!=null){const kmh=Number(x.windSpeed);if(Number.isFinite(kmh)){x.windSpeed=String([1,6,12,20,29,39,50,62,75,89,103,118].filter(v=>kmh>=v).length)}}x.windUnit="bft";return x}
const formatClock=t=>{const seconds=Math.max(0,Math.floor(Number(t)||0));return String(Math.floor(seconds/3600)).padStart(2,"0")+":"+String(Math.floor(seconds%3600/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")};
function currentSeconds(){
 if(st.ended||!st.clockRunning||!Number.isFinite(Number(st.clockAnchor)))return Math.max(0,Number(st.clock)||0);
 const anchor=Number(st.clockAnchor),base=Number(st.clockBase??st.clock)||0;
 return Math.max(0,base+Math.floor(Math.max(0,Date.now()-anchor)/1000));
}
const stamp=()=>formatClock(currentSeconds());
function renderSyncedClock(){
 const shown=st.ended?(st.endedAt||stamp()):stamp();
 const leader=$("#timeCounter"),participant=$("#participantTime"),status=$("#participantClockStatus");
 if(leader)leader.textContent=shown;
 if(participant)participant.textContent=shown;
 if(status)status.textContent=st.ended?"Beendet":st.clockRunning?"Läuft":st.started?"Pausiert":"Nicht gestartet";
}
function cueHeading(type){
 return {fire:"Brandentwicklung",smoke:"Rauchentwicklung",person:"Personenlage",vehicle:"Fahrzeuge / Kräfte",report:"Funkspruch",other:"Sonstige Entwicklung"}[type]||"Lagemeldung";
}

function log(type,detail){if(type==="Teilnehmerfreigabe")return;if(isViewer||!st.started||(st.ended&&type!=="Übungsende"))return;st.journal.push({time:stamp(),type,detail});if(st.journal.length>300)st.journal.shift();if(!Array.isArray(st.history))st.history=[];st.history.push({id:uid(),time:stamp(),type,detail,objects:structuredClone(st.objects),cue:st.activeCue?{...st.activeCue}:null,wildfires:structuredClone(st.wildfires||[]),center:[...st.mapCenter],zoom:st.mapZoom});if(st.history.length>90)st.history.shift();renderHistory()}
function persist(){if(isViewer)return;
 try{localStorage.setItem("taktikplatte-wizard-v5",JSON.stringify(st))}catch(e){console.warn("Bilder konnten nicht vollständig gespeichert werden",e);toast("Speicherplatz im Browser voll – bitte Bilder entfernen oder Einsatz exportieren.",true)}
 bc?.postMessage({kind:"sync",state:{...st,gallery:(st.gallery||[]).filter(x=>x.released)}})
}
function toast(msg,err=false){const el=$("#toast");el.textContent=msg;el.className="toast show"+(err?" error":"");setTimeout(()=>{if(el.textContent===msg)el.className="toast"},5000)}
const put=(id,key)=>{const el=$("#"+id);if(el)el.value=st[key]??""};
const get=(id,key)=>{const el=$("#"+id);if(el)st[key]=el.value};
const meter=(p,q)=>{const r=Math.PI/180,x=(q.lat-p.lat)*r,y=(q.lon-p.lon)*r;const a=Math.sin(x/2)**2+Math.cos(p.lat*r)*Math.cos(q.lat*r)*Math.sin(y/2)**2;return 12742000*Math.asin(Math.sqrt(a))};
function vehicleDrawing(type="",small=false){
 const t=String(type||"").toUpperCase().replace(/\s+/g," ");
 const ladder=/\b(DLK|DLA|DL|TM|GM)\b/.test(t);
 const rescue=/\b(RW|GW[- ]?G|GW[- ]?L)\b/.test(t);
 const tanker=/\b(TLF|STLF)\b/.test(t);
 const command=/\b(ELW|MTF|MTW|KDO)\b/.test(t);
 const ambulance=/\b(RTW|KTW|NEF)\b/.test(t);
 const truck=!command&&!ambulance;
 const label=ladder?"DLK":rescue?"RW":tanker?"TLF":command?"ELW":ambulance?"RD":/HLF/.test(t)?"HLF":/LF/.test(t)?"LF":"FW";
 const width=small?34:52;
 const background=ambulance?"#f6f2e2":command?"#f2f4f7":"#cf2930";
 const side=ambulance?"#cf3535":command?"#df272c":"#9f1b24";
 let equipment="";
 if(ladder){
  equipment='<rect x="15" y="30" width="34" height="43" rx="3" fill="#dadfe3" stroke="#43566a" stroke-width="1.5"/><g stroke="#788a99" stroke-width="2"><path d="M18 36h28M18 42h28M18 48h28M18 54h28M18 60h28M18 66h28"/></g><circle cx="32" cy="52" r="7" fill="#9faebd" stroke="#334759" stroke-width="2"/>';
 }else if(rescue){
  equipment='<rect x="11" y="31" width="42" height="46" rx="2" fill="#cfd7dc" stroke="#7c8e99"/><g stroke="#718594" stroke-width="2"><path d="M11 42h42M11 53h42M11 64h42M24 31v46M39 31v46"/></g><rect x="24" y="53" width="15" height="11" rx="1" fill="#596c7a"/>';
 }else if(tanker){
  equipment='<rect x="12" y="33" width="40" height="43" rx="6" fill="#e5e9e9" stroke="#64798b" stroke-width="2"/><rect x="20" y="37" width="24" height="33" rx="5" fill="#a6b8c3" stroke="#607584"/><path d="M32 37v33" stroke="#f4f5f4" stroke-width="3"/>';
 }else if(truck){
  equipment='<rect x="12" y="33" width="40" height="45" rx="2" fill="#e9edf0" stroke="#8d9aa3"/><g stroke="#657b8d" stroke-width="2"><path d="M12 45h40M12 57h40M12 69h40M25 33v45M39 33v45"/></g><rect x="27" y="58" width="10" height="10" rx="2" fill="#657b8d"/>';
 }else equipment='<rect x="13" y="37" width="38" height="35" rx="4" fill="#e6e9eb" stroke="#788a97"/><rect x="19" y="44" width="26" height="18" rx="2" fill="#aec8d8"/><path d="M19 56h26" stroke="#fff" stroke-width="2"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+Math.round(width*1.34)+'" viewBox="0 0 64 88" fill="none" aria-label="Fahrzeug '+label+'">'+
 '<ellipse cx="32" cy="80" rx="26" ry="5" fill="#051a2d" opacity=".18"/>'+
 '<rect x="5" y="15" width="54" height="66" rx="9" fill="'+side+'" stroke="#73131c" stroke-width="2"/>'+
 '<rect x="9" y="17" width="46" height="61" rx="6" fill="'+background+'" stroke="#f7b0ad" stroke-width="1.5"/>'+
 '<rect x="11" y="19" width="42" height="13" rx="3" fill="#243d53"/><path d="M31 19v13" stroke="#7a95a9"/>'+
 '<rect x="12" y="17" width="13" height="3" rx="1" fill="#2473cb"/><rect x="39" y="17" width="13" height="3" rx="1" fill="#2473cb"/>'+
 equipment+
 '<rect x="7" y="79" width="50" height="6" rx="2" fill="#e8e9dc" stroke="#8c9799"/>'+
 '<text x="32" y="'+(truck?"74":"77")+'" text-anchor="middle" fill="'+(truck?"#293e4e":"#202d38")+'" font-size="10" font-weight="900">'+label+'</text></svg>';
}
function fireDrawing(small=false){
 const n=small?40:52;
 return '<svg width="'+n+'" height="'+n+'" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" aria-label="Brandstelle">'+
 '<defs><radialGradient id="ember" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#ffe27e"/><stop offset=".5" stop-color="#fa5826"/><stop offset="1" stop-color="#b51e19" stop-opacity=".2"/></radialGradient><linearGradient id="fheat" x1="0" y1="1" x2=".4" y2="0"><stop stop-color="#f54d11"/><stop offset=".65" stop-color="#ff9f23"/><stop offset="1" stop-color="#ffe47a"/></linearGradient></defs>'+
 '<ellipse cx="32" cy="53" rx="27" ry="8" fill="url(#ember)" opacity=".75"/>'+
 '<path d="M32 5c4 12-4 19 2 27 4-8 9-9 6-21 15 15 21 26 13 40-5 10-18 13-31 9C5 53 8 34 18 24c-1 10 3 15 8 18C23 29 22 15 32 5Z" fill="#b9271b" stroke="#8f2119" stroke-width="1.4"/>'+
 '<path d="M29 13c6 12-1 17 6 25 2-7 7-8 8-14 9 15 10 26-2 33-11 7-25-1-24-15 1-9 6-13 7-18 2 10-2 15 4 20 2-9 0-18 1-31Z" fill="url(#fheat)"/>'+
 '<path d="M31 29c1 10-6 15-2 20 3-3 6-5 6-12 6 8 6 17-2 19-10 2-12-7-8-14 1 4 3 5 6-13Z" fill="#ffeeb2"/></svg>';
}
function icon(kind,small=false,vehicleType=""){if(kind==="fahrzeug")return vehicleDrawing(vehicleType,small);if(kind==="brand")return fireDrawing(small);const s=small?26:40,c=kind==="fahrzeug"?"#d52f37":kind==="brand"?"#ec452b":kind==="rauch"?"#71838f":kind==="gefahr"?"#e7a835":kind==="leitung"?"#efc75b":kind==="wasser"?"#338ada":"#183348";const wrap=inner=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+inner+"</svg>";
if(kind==="fahrzeug")return wrap('<rect x="5" y="13" width="36" height="24" rx="4" fill="'+c+'" stroke="#8f1720" stroke-width="2"/><path d="M11 13v-5h15v5M32 14v20" stroke="#f3eff0" stroke-width="2"/><rect x="33" y="18" width="8" height="8" fill="#d4e8f0"/><circle cx="14" cy="38" r="4" fill="#1a2836" stroke="#fff"/><circle cx="34" cy="38" r="4" fill="#1a2836" stroke="#fff"/><rect x="8" y="25" width="19" height="3" rx="1" fill="#f5dd5a"/>');
if(kind==="brand")return wrap('<path d="M24 5c2 11-5 12 0 19 3-5 4-8 4-11 12 11 14 29-4 30C9 43 7 28 15 19c1 8 4 6 4 0 0-6 2-10 5-14Z" fill="#e95428" stroke="#942b18" stroke-width="2"/><path d="M25 24c0 5-3 7-1 9 1-2 2-4 3-5 6 8 2 13-3 13-6 0-10-7-5-13 0 5 3 5 6-4Z" fill="#ffd75d"/>');
if(kind==="rauch")return wrap('<path d="M6 32c-2-7 4-13 11-12 0-8 10-12 16-5 9-2 16 9 10 17-4 6-31 8-37 0Z" fill="#8896a0" stroke="#435462" stroke-width="2"/><path d="M14 23c3-7 11-9 16-4" stroke="#dae2e8" stroke-width="2" opacity=".8"/>');
if(["person","verletzt","vermisst","gerettet","tot"].includes(kind)){let sym={person:"",verletzt:"+",vermisst:"?",gerettet:"✓",tot:"×"}[kind];return wrap('<circle cx="23" cy="10" r="5.4" fill="#172938"/><path d="M23 17v15m-9-9 9-5 10 5M23 32l-9 10m9-10 10 10" stroke="#172938" stroke-width="4" stroke-linecap="round"/>'+(sym?'<circle cx="37" cy="12" r="10" fill="#fff" stroke="#172938"/><text x="37" y="17" text-anchor="middle" font-size="17" font-weight="800" fill="#172938">'+sym+"</text>":""))}
if(kind==="gefahr")return wrap('<path d="M24 5 45 43H3L24 5Z" fill="#f3cb62" stroke="#8a2b22" stroke-width="3"/><text x="24" y="36" text-anchor="middle" font-weight="900" font-size="26" fill="#1d2e40">!</text>');
if(kind==="wasser")return wrap('<path d="M24 5C15 20 10 24 10 31a14 14 0 0 0 28 0c0-7-6-15-14-26Z" fill="#428fdd" stroke="#184c83" stroke-width="2"/><path d="M18 30c0 5 3 8 7 8" stroke="white" stroke-width="3" stroke-linecap="round"/>');
const txt={bereitstellung:"BR",leitung:"EL",abschnitt:"EA",vu:"VU"}[kind]||"?";
return wrap('<path d="M24 3 45 24 24 45 3 24Z" fill="'+c+'" stroke="#dae7f0" stroke-width="2"/><text x="24" y="29" font-size="'+(txt.length>2?12:17)+'" font-weight="800" text-anchor="middle" fill="'+(kind==="leitung"?"#192838":"#fff")+'">'+txt+"</text>")}
function stepText(){const step=isViewer?3:st.step;$$("[data-step]").forEach((b,i)=>{b.classList.toggle("current",i===step);b.classList.toggle("finished",i<step);b.setAttribute("aria-current",i===step?"step":"false")});$("[data-step-title]").textContent=steps[step];$("#progress").style.width=((step+1)/4*100)+"%"}
function captureVehicleInputs(){if(isViewer)return;$$("[data-v][data-field]").forEach(input=>{const v=(st.vehicles||[]).find(item=>item.id===input.dataset.v);if(v)v[input.dataset.field]=input.value})}
function storeForm(){if(isViewer)return;captureVehicleInputs();for(const key of ["title","stichwort","meldebild","address","date","time","weather","temp","windDir","windSpeed","visibility","scene"]){const el=$('[name="'+key+'"]');if(el)st[key]=el.value}st.dynamic=$("#dynamicEnabled")?.checked??st.dynamic;persist()}
function form(){for(const key of ["title","stichwort","meldebild","address","date","time","weather","temp","windDir","windSpeed","visibility","scene"]){const el=$('[name="'+key+'"]');if(el)el.value=st[key]??""}$("#dynamicEnabled").checked=st.dynamic;renderVehicles();renderPhoto();renderCues();renderVersions();updateSummary()}
function go(step,skipFormSave=false){if(step<0||step>3)return;document.body.classList.remove("landing-mode");if(!skipFormSave)storeForm();st.step=step;$$(".step-content").forEach((e,i)=>e.classList.toggle("active",i===step));stepText();form();if(step===3){syncAlarmedVehicles();setupMap();renderTools();requestAnimationFrame(()=>{map?.resize();setTimeout(()=>map?.resize(),180)})}window.scrollTo({top:0,behavior:"smooth"});persist()}
/* Vehicles configured in step 1 become movable initial map symbols.
   Manual placement remains authoritative; do not relocate existing markers. */
function syncAlarmedVehicles(){
 if(isViewer)return;
 if(!Array.isArray(st.objects))st.objects=[];
 if(!Array.isArray(st.vehicleMapRemoved))st.vehicleMapRemoved=[];
 const active=new Set((st.vehicles||[]).map(v=>v.id));
 st.objects=st.objects.filter(o=>!o.sourceVehicleId||active.has(o.sourceVehicleId));
 const center=Array.isArray(st.mapCenter)?st.mapCenter:[8.626,50.513];
 for(const [i,v] of (st.vehicles||[]).entries()){
  if(!v.type?.trim()||st.vehicleMapRemoved.includes(v.id))continue;
  let obj=st.objects.find(o=>o.sourceVehicleId===v.id);
  if(!obj){
   const dx=(i%4)*.00017,dy=Math.floor(i/4)*.00013;
   obj={id:uid(),type:"fahrzeug",sourceVehicleId:v.id,lat:center[1]-dy,lon:center[0]+dx,org:v.org||"fw",vehicleType:v.type,radio:v.radio||"",crew:v.crew||"",size:1,rotation:0};
   st.objects.push(obj);
  }
  obj.vehicleType=v.type;obj.radio=v.radio||"";obj.crew=v.crew||"";obj.org=v.org||"fw";
  obj.label=v.type+(v.radio?" · "+v.radio:"");
 }
}
function renderVehicles(){$("#vehicles").innerHTML=st.vehicles.map((v,i)=>'<div class="vehicle-line"><div class="field"><label>Fahrzeug</label><input data-v="'+v.id+'" data-field="type" list="alarmVehicleTypes" value="'+safe(v.type)+'" placeholder="z. B. StLF 20/25"></div><div class="field"><label>Funkrufname</label><input data-v="'+v.id+'" data-field="radio" value="'+safe(v.radio)+'" placeholder="2-42-1"></div><div class="field"><label>Stärke</label><input data-v="'+v.id+'" data-field="crew" value="'+safe(v.crew)+'" placeholder="0/1/8/9"></div><button class="icon-btn" title="Fahrzeug entfernen" data-del-v="'+v.id+'">×</button></div>').join("");$$("[data-v]").forEach(x=>{const update=()=>{const v=st.vehicles.find(item=>item.id===x.dataset.v);if(v){v[x.dataset.field]=x.value;if(st.step===3){syncAlarmedVehicles();renderMarkers();}}persist()};x.oninput=update;x.onchange=update});$$("[data-del-v]").forEach(x=>x.onclick=()=>{st.vehicles=st.vehicles.filter(v=>v.id!==x.dataset.delV);syncAlarmedVehicles();renderVehicles();renderMarkers();persist()})}
$("#addVehicle").onclick=()=>{storeForm();st.vehicles.push({id:uid(),type:"",radio:"",crew:""});renderVehicles();persist()};
$$("[data-step]").forEach(x=>x.onclick=()=>!isViewer&&go(+x.dataset.step));
$$("[data-next]").forEach(x=>x.onclick=()=>go(st.step+1));
$$("[data-back]").forEach(x=>x.onclick=()=>go(st.step-1));
$$("input[name],textarea[name],select[name]").forEach(el=>el.addEventListener("change",storeForm));
$("#dynamicEnabled").onchange=()=>{st.dynamic=$("#dynamicEnabled").checked;$("#dynamicBlock").classList.toggle("disabled",!st.dynamic);persist()};
$("#skipDynamic").onclick=()=>{st.dynamic=false;go(3)};
function toggleIntensity(categoryId,fieldId,labelId){
 const type=$(categoryId).value,show=type==="fire"||type==="smoke";
 $(fieldId).hidden=!show;
 $(labelId).textContent=type==="fire"?"Ausmaß der Brandentwicklung":"Ausmaß der Rauchentwicklung";
}
function toggleCueSender(typeId,fieldId){const el=$(fieldId);if(el)el.hidden=$(typeId).value!=="report"}
$("#cueType").onchange=()=>{toggleIntensity("#cueType","#cueIntensityField","#cueIntensityLabel");toggleCueSender("#cueType","#cueSenderField")};
$("#liveType").onchange=()=>{toggleIntensity("#liveType","#liveIntensityField","#liveIntensityLabel");toggleCueSender("#liveType","#liveSenderField")};
toggleIntensity("#cueType","#cueIntensityField","#cueIntensityLabel");
toggleIntensity("#liveType","#liveIntensityField","#liveIntensityLabel");toggleCueSender("#cueType","#cueSenderField");toggleCueSender("#liveType","#liveSenderField");
$("#addCue").onclick=()=>{
 storeForm();
 const type=$("#cueType").value,affected=type==="fire"||type==="smoke";
 if(!$("#cueText").value.trim())return toast("Bitte einen konkreten Meldungstext eingeben.",true);
 st.cues.push({id:uid(),minute:Number($("#cueMinute").value)||0,type,description:$("#cueText").value.trim(),sender:type==="report"?$("#cueSender").value.trim():"",state:"ready",...(affected?{intensity:Number($("#cueIntensity").value)}:{})});
 $("#cueText").value="";$("#cueSender").value="";renderCues();triggerScheduledCues();persist();
};
function renderCues(){
 const list=Array.isArray(st.cues)?st.cues:[];const out=$("#cues");
 out.innerHTML=list.map(c=>'<article class="cue"><div><strong>'+safe(c.description)+'</strong><p>ab Minute '+c.minute+' · '+safe(c.type)+(c.state==="played"?" · Freigegeben":" · Ausstehend")+'</p></div><div class="cue-actions"><button data-play="'+c.id+'" class="small">'+(c.state==="played"?"Erneut":"Einspielen")+'</button><button data-remove="'+c.id+'" class="icon-btn">×</button></div></article>').join("")||'<p class="helper">Noch keine Ereignisse vorbereitet.</p>';
 const live=$("#cuesLive");
 if(live)live.innerHTML=[...list].sort((a,b)=>a.minute-b.minute).map(c=>'<article class="cue"><div><strong>'+safe(c.description)+'</strong><p>Minute '+c.minute+' · '+safe(c.type)+' · '+(c.state==="played"?"Freigegeben":"Ausstehend")+'</p></div><button type="button" class="small" data-play="'+c.id+'">'+(c.state==="played"?"Erneut":"Freigeben")+'</button></article>').join("")||'<p class="helper">Keine Ereignisse vorbereitet. Du kannst unter Schritt 3 neue Ereignisse anlegen.</p>';
 $$("[data-play]").forEach(x=>x.onclick=()=>{const c=st.cues.find(v=>v.id===x.dataset.play);if(c&&!isViewer)playCue(c)});
 $$("[data-remove]").forEach(x=>x.onclick=()=>{st.cues=st.cues.filter(v=>v.id!==x.dataset.remove);renderCues();persist()});
 $("#dynamicBlock").classList.toggle("disabled",!st.dynamic);
 renderHistory();
}
function affectedCue(type,intensity,original){
 const current=st.activeCue||{},next={type,description:original.description,sender:type==="report"?String(original.sender||"").trim():"",fire:current.fire??0,smoke:current.smoke??0};
 if(type==="fire")next.fire=intensity===undefined?Number(original.fire??0):Number(intensity);
 if(type==="smoke")next.smoke=intensity===undefined?Number(original.smoke??0):Number(intensity);
 return next;
}
function triggerScheduledCues(){
 if(isViewer||!st.started||st.ended||!st.clockRunning||!Array.isArray(st.cues))return;
 const elapsed=currentSeconds();
 const due=st.cues.filter(c=>c.state!=="played"&&Number.isFinite(Number(c.minute))&&Number(c.minute)>=0&&elapsed>=Number(c.minute)*60);
 due.sort((a,b)=>Number(a.minute)-Number(b.minute));
 for(const c of due)playCue(c);
}
function playCue(c){
 if(st.ended)return toast("Der Einsatz ist beendet.",true);
 if(!st.started)return toast("Bitte zuerst den Übungsdurchlauf mit „Start“ beginnen.",true);
 c.state="played";st.activeCue=affectedCue(c.type,c.intensity,c);
 st.cueSignal={id:uid(),at:Date.now()};
 log("Einspielung",c.description);renderCues();updateSummary();renderParticipantScene();signalCueFlash();renderMarkers();persist();toast("Lageänderung freigegeben");
}
$("#applyNow").onclick=()=>{
 if(st.ended)return toast("Der Einsatz ist beendet.",true);
 if(!st.started)return toast("Bitte zuerst den Übungsdurchlauf mit „Start“ beginnen.",true);
 const text=$("#liveText").value.trim();if(!text)return;
 const type=$("#liveType").value,degree=(type==="fire"||type==="smoke")?Number($("#liveIntensity").value):undefined;
 st.activeCue=affectedCue(type,degree,{description:text,sender:type==="report"?$("#liveSender").value.trim():""});
 st.cueSignal={id:uid(),at:Date.now()};log("Spontane Lageänderung",text);
 $("#liveText").value="";$("#liveSender").value="";renderParticipantScene();signalCueFlash();renderMarkers();persist();toast("Spontane Lageänderung freigegeben");
};

/* Photo gallery of released and unreleased viewpoints. */
function availableGallery(){return(st.gallery||[]).filter(p=>p.released)}
function findGalleryPhoto(id){return(st.gallery||[]).find(p=>p.id===id)}
function renderGalleryEditor(){
 if(isViewer)return;
 const list=Array.isArray(st.gallery)?st.gallery:[];
 const editor=$("#galleryEditList"),director=$("#galleryDirectorList");
 editor.innerHTML=list.map((p,i)=>'<article class="gallery-edit-entry"><img alt="" src="'+p.dataUrl+'"><div><div class="field"><label>Ansicht '+(i+1)+' · Name</label><input data-gallery-name="'+safe(p.id)+'" value="'+safe(p.title)+'" maxlength="90"></div><div class="gallery-entry-actions"><span class="gallery-privacy '+(p.released?'released':'')+'">'+(p.released?'Freigegeben':'Nicht freigegeben')+'</span><button type="button" data-gallery-release="'+safe(p.id)+'">'+(p.released?'Sperren':'Freigeben')+'</button><button type="button" data-gallery-show="'+safe(p.id)+'">Jetzt anzeigen</button><button type="button" data-gallery-remove="'+safe(p.id)+'">Entfernen</button></div></div></article>').join("")||'<p class="helper">Noch keine zusätzlichen Bilder hochgeladen.</p>';
 director.innerHTML=list.map(p=>'<div class="gallery-director-entry"><img src="'+p.dataUrl+'" alt=""><div class="gallery-director-details"><strong>'+safe(p.title)+'</strong><small>'+(p.released?'Freigegeben':'Vorbereitet · verborgen')+'</small></div><button type="button" data-gallery-release="'+safe(p.id)+'">'+(p.released?'Sperren':'Freigeben')+'</button><button type="button" data-gallery-show="'+safe(p.id)+'" '+(!p.released?'disabled':'')+'>Anzeigen</button></div>').join("")||'<p class="helper">Zusätzliche Ansichten können in Schritt 2 hochgeladen werden.</p>';
 editor.querySelectorAll("[data-gallery-name]").forEach(input=>input.onchange=()=>{const p=findGalleryPhoto(input.dataset.galleryName);if(!p)return;p.title=input.value.trim()||"Zusatzansicht";renderGalleryEditor();renderParticipantScene();persist()});
 $$("[data-gallery-release]").forEach(b=>b.onclick=()=>{const p=findGalleryPhoto(b.dataset.galleryRelease);if(!p)return;p.released=!p.released;if(!p.released&&st.activeGalleryId===p.id)st.activeGalleryId=null;renderGalleryEditor();renderParticipantScene();persist();toast(p.released?"Ansicht freigegeben":"Ansicht verborgen")});
 $$("[data-gallery-show]").forEach(b=>b.onclick=()=>{const p=findGalleryPhoto(b.dataset.galleryShow);if(!p)return;if(!p.released)return toast("Bitte die Ansicht zuerst freigeben.",true);st.activeGalleryId=p.id;participantChosenPhoto=null;log("Fotoeinspielung",p.title);renderParticipantScene();persist();toast("Ansicht für Fahrzeugführer gewechselt")});
 $$("[data-gallery-remove]").forEach(b=>b.onclick=()=>{const p=findGalleryPhoto(b.dataset.galleryRemove);if(!p)return;if(!confirm("Zusatzbild "+p.title+" entfernen?"))return;st.gallery=st.gallery.filter(x=>x.id!==p.id);if(st.activeGalleryId===p.id)st.activeGalleryId=null;renderGalleryEditor();renderParticipantScene();persist()});
}
function renderParticipantGallery(){
 const bar=$("#participantGalleryBar"),host=$("#participantGalleryChoices");
 const choices=[];
 if(st.imageUrl&&(!isViewer||st.releaseFront!==false))choices.push({id:"original",title:"Ausgangsansicht",dataUrl:st.imageUrl});
 for(const p of availableGallery())choices.push(p);
 if(participantChosenPhoto&&!choices.some(p=>p.id===participantChosenPhoto))participantChosenPhoto=null;
 const selected=participantChosenPhoto||((choices.some(p=>p.id===st.activeGalleryId))?st.activeGalleryId:null)||choices[0]?.id;
 bar.hidden=!choices.length;$("#galleryAvailableCount").textContent=choices.length+" Ansichten";
 host.innerHTML=choices.map(p=>'<button type="button" data-view-gallery="'+safe(p.id)+'" class="'+(p.id===selected?'selected':'')+'"><img src="'+p.dataUrl+'" alt=""><span>'+safe(p.title)+'</span></button>').join("");
 host.querySelectorAll("[data-view-gallery]").forEach(b=>b.onclick=()=>{participantChosenPhoto=b.dataset.viewGallery;renderParticipantScene()});
 return choices.find(p=>p.id===selected)||null;
}
$("#galleryUpload").onchange=async e=>{
 const files=Array.from(e.target.files||[]),status=$("#galleryUploadStatus");if(!files.length)return;
 status.textContent="Bilder werden für das Planspiel vorbereitet …";
 let added=0;const issues=[];
 for(const file of files){
  if((st.gallery||[]).length>=10){issues.push("Maximal zehn zusätzliche Ansichten.");break}
  try{
   const dataUrl=await compressUploadedImage(file,1100,.67);
   if(JSON.stringify(st).length+dataUrl.length>4_400_000)throw Error("Browserspeicher nahezu voll – bitte Bilder entfernen oder exportieren.");
   st.gallery.push({id:uid(),title:file.name.replace(/\.[^.]+$/,"").slice(0,80)||"Zusatzansicht",dataUrl,released:false});
   added++
  }catch(err){issues.push(file.name+": "+err.message)}
 }
 e.target.value="";renderGalleryEditor();persist();
 status.textContent=added+" Bild(er) vorbereitet. "+issues.join(" · ");
 toast(issues.length?issues[0]:added+" Einsatzbilder gespeichert",!!issues.length);
};

function renderPhoto(){const img=$("#frontPhoto"),empty=$("#frontEmpty");if(st.imageUrl){img.src=st.imageUrl;img.hidden=false;empty.hidden=true;img.onerror=()=>{img.hidden=true;empty.hidden=false;empty.textContent="Bild konnte nicht geladen werden. Eine andere Aufnahme wählen.";};}else{img.hidden=true;empty.hidden=false;empty.textContent="Wähle eine Adresse und suche eine verfügbare Straßenaufnahme."}
$("#photoCredit").textContent=st.imageCredit||"Noch keine Bildquelle ausgewählt";$("#photoAddressHint").textContent=st.address||"In Schritt 1 eine Einsatzadresse angeben.";$("#photoCount").textContent=photos.length?photoIndex+1+" / "+photos.length:"";renderGalleryEditor();renderParticipantScene()}
function renderVersions(){$("#versions").innerHTML=st.versions.map((v,i)=>'<article class="cue"><div><strong>'+safe(v.title)+'</strong><p>'+safe(v.description)+' · Bildvorlage gespeichert</p></div><button class="small" data-version="'+i+'">Als Ansicht wählen</button></article>').join("")||'<p class="helper">Noch keine Bildvarianten gespeichert.</p>';$$("[data-version]").forEach(x=>x.onclick=()=>{let v=st.versions[+x.dataset.version];st.scene=v.description;st.imageUrl=v.imageUrl;st.imageCredit=v.imageCredit;form();persist()})}
$("#saveScene").onclick=()=>{storeForm();if(!st.imageUrl)return toast("Bitte zuerst eine Straßenaufnahme auswählen",true);const description=st.scene.trim();if(!description)return toast("Bitte eine Lagebeschreibung eingeben",true);st.versions.push({id:uid(),title:"Szenenstand "+(st.versions.length+1),description,imageUrl:st.imageUrl,imageCredit:st.imageCredit});renderVersions();persist();toast("Szenenstand als Vorlage gespeichert. Eine KI-Bildbearbeitung ist noch nicht angeschlossen.")};
$("#generateScene").onclick=()=>toast("Die realistische KI-Bildbearbeitung ist vorbereitet, aber noch nicht mit einem Backend verbunden. Vorerst kannst du Lagebeschreibungen als Szenenstand speichern.",true);
function imgLoad(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(url);i.onerror=()=>reject(new Error("Bild nicht abrufbar"));i.src=url})}
async function searchPhotos(lat,lon){st.imageLat=lat;st.imageLon=lon;$("#photoStatus").textContent="Suche nach Straßenaufnahmen …";photos=[];photoIndex=0;let panoError="",mError="";
try{for(const deg of [.001,.004,.012]){const u=new URL("https://api.panoramax.xyz/api/search");u.searchParams.set("bbox",[lon-deg,lat-deg,lon+deg,lat+deg].join(","));u.searchParams.set("limit","70");const r=await fetch(u);if(!r.ok)throw new Error("Panoramax HTTP "+r.status);const x=await r.json();const list=(x.features||[]).map(f=>{const assets=f.assets||{},url=assets.sd?.href||assets.visual?.href||assets.thumbnail?.href||assets.thumb?.href||null,point=f.geometry?.coordinates;return url&&point?{url:new URL(url,u).href,source:"Panoramax",id:f.id,m:meter({lat,lon},{lat:point[1],lon:point[0]})}:null}).filter(Boolean);photos.push(...list);if(photos.length)break}}catch(e){panoError=e.message}
if(!photos.length){const token=localStorage.getItem("taktikplatte-mapillary-token")||"";if(token){try{const d=.009,u=new URL("https://graph.mapillary.com/images");u.searchParams.set("access_token",token);u.searchParams.set("bbox",[lon-d,lat-d,lon+d,lat+d].join(","));u.searchParams.set("fields","id,geometry,thumb_1024_url");u.searchParams.set("limit","100");const r=await fetch(u);if(!r.ok)throw new Error("Mapillary HTTP "+r.status);const x=await r.json();photos=(x.data||[]).map(f=>{let c=f.geometry?.coordinates;return c&&f.thumb_1024_url?{url:f.thumb_1024_url,source:"Mapillary",id:f.id,m:meter({lat,lon},{lat:c[1],lon:c[0]})}:null}).filter(Boolean)}catch(e){mError=e.message}}}
photos.sort((a,b)=>a.m-b.m);photos=photos.filter((p,i,a)=>a.findIndex(q=>q.id===p.id&&q.source===p.source)===i).slice(0,20);
if(photos.length){await showPhoto(0);return}
$("#photoStatus").textContent="Keine passenden Straßenbilder gefunden. "+(panoError?"Panoramax: "+panoError+". ":"")+(mError?"Mapillary: "+mError+". ":"")+"Mapillary kann optional mit einem Client Token ergänzt werden.";toast("Für diesen Standort ist keine nutzbare Aufnahme verfügbar",true)
}
async function showPhoto(n){if(!photos.length)return;for(let i=0;i<photos.length;i++){const idx=(n+i+photos.length)%photos.length,p=photos[idx];$("#photoStatus").textContent="Lade Straßenbild "+(idx+1)+" / "+photos.length+" …";try{await imgLoad(p.url);photoIndex=idx;st.imageUrl=p.url;st.imageSource=p.source;st.imageCredit=p.source+" · Foto "+p.id+" · ca. "+Math.round(p.m)+" m entfernt";$("#photoStatus").textContent="Bild geladen. Bitte prüfen, ob die Perspektive das richtige Gebäude zeigt.";renderPhoto();persist();return}catch{}}
$("#photoStatus").textContent="Straßenbilder wurden gefunden, aber keines konnte geladen werden.";toast("Die gefundenen Bildlinks sind nicht abrufbar",true)}
$("#prevPhoto").onclick=()=>showPhoto(photoIndex-1);$("#nextPhoto").onclick=()=>showPhoto(photoIndex+1);

async function compressUploadedImage(file,maxDim=1400,initialQuality=.77){
  if(!file.type.startsWith("image/"))throw new Error("Bitte eine Bilddatei auswählen.");
  const objectURL=URL.createObjectURL(file);
  try{
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error("Bildformat kann vom Browser nicht geöffnet werden."));i.src=objectURL});
    const scale=Math.min(1,maxDim/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
    canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext("2d");
    if(!ctx)throw new Error("Bild konnte nicht verarbeitet werden.");
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    let quality=initialQuality,output=canvas.toDataURL("image/jpeg",quality);
    while(output.length>2_200_000&&quality>.4){quality-=.12;output=canvas.toDataURL("image/jpeg",quality)}
    if(output.length>3_000_000)throw new Error("Bild nach dem Verkleinern noch zu groß. Bitte ein kleineres Foto verwenden.");
    return output;
  }finally{URL.revokeObjectURL(objectURL)}
}
$("#uploadFrontImage").onchange=async e=>{
  const file=e.target.files?.[0];if(!file)return;
  $("#uploadFrontStatus").textContent="Bild wird lokal verarbeitet …";
  try{
    const url=await compressUploadedImage(file);
    st.imageUrl=url;
    st.imageSource="Eigener Upload";
    st.imageCredit="Eigenes Bild · "+file.name+" · lokal im Browser";
    photos=[];photoIndex=0;
    renderPhoto();persist();
    $("#photoStatus").textContent="Eigenes Bild als Frontalansicht übernommen.";
    $("#uploadFrontStatus").textContent="Foto übernommen. Es wird lokal gespeichert und kann als Szenenstand verwendet werden.";
    toast("Eigenes Foto erfolgreich übernommen");
  }catch(err){$("#uploadFrontStatus").textContent=err.message;toast(err.message,true)}
  e.target.value="";
};

$("#mapillaryToken").value=localStorage.getItem("taktikplatte-mapillary-token")||"";$("#mapillaryToken").onchange=e=>{localStorage.setItem("taktikplatte-mapillary-token",e.target.value.trim());toast("Mapillary-Zugang gespeichert")};
$("#findAddress").onclick=async()=>{storeForm();const q=st.address.trim();if(!q)return toast("Bitte eine Einsatzadresse eingeben",true);$("#photoStatus").textContent="Suche Adresse …";try{const r=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q));const d=await r.json();if(!d.length)throw Error("Adresse nicht gefunden");const lat=+d[0].lat,lon=+d[0].lon;st.mapCenter=[lon,lat];st.mapZoom=17;await searchPhotos(lat,lon)}catch(e){$("#photoStatus").textContent="Ortssuche fehlgeschlagen: "+e.message}};
$("#findPhoto").onclick=()=>{if(st.imageLat!=null)searchPhotos(st.imageLat,st.imageLon);else $("#findAddress").click()};
function updateSummary(){
 renderWind();const rows=[["Alarmstichwort",st.stichwort||"–"],["Einsatzort",st.address||"Noch nicht angegeben"],["Wetter / Wind",(st.weather||"–")+" · "+(st.windDir||"–")+" · "+beaufortDescription(st.windSpeed)],["Ersteintreffende Fahrzeuge",st.vehicles.length+" Fahrzeug(e)"]];
 if(!isViewer)rows.push(["Lageentwicklung",st.dynamic?"Manuell steuerbar":"Klassisches Planspiel"]);
 $("#summary").innerHTML=rows.map(([key,val])=>'<div><span>'+safe(key)+'</span><b>'+safe(val)+'</b></div>').join("");
}
function renderParticipantScene(){
 const p=$("#participantPhoto"),w=$("#participantPhotoEmpty");
 const selected=renderParticipantGallery();
 if(selected?.dataUrl){if(p.getAttribute("src")!==selected.dataUrl)p.src=selected.dataUrl;p.hidden=false;w.hidden=true;p.onerror=()=>{p.hidden=true;w.hidden=false;w.textContent="Bild nicht geladen."}}
 else{p.hidden=true;w.hidden=false;w.textContent="Noch keine Ansicht freigegeben."}
 const c=st.activeCue,msg=String(c?.description||"").trim();
 $("#participantCue").textContent=c?(msg&&msg!=="Neue Lagemeldung"?msg:"Für diese Einspielung fehlt ein Meldungstext."):st.meldebild||"Ausgangslage – Erkundung beginnen.";
 $("#participantSceneTitle").textContent=st.ended?"Einsatz beendet":c?cueHeading(c.type):"Erstes Lagebild";const senderEl=$("#participantCueSender");if(senderEl){const from=c?.type==="report"?String(c.sender||"").trim():"";senderEl.hidden=!from;senderEl.textContent=from?"Von: "+from:"";}
 $("#participantSceneNote").textContent=selected?.title||st.imageCredit||"Frontalansicht des Einsatzobjekts";
 if(isViewer)refreshReleaseViews();renderEnded();renderSyncedClock();
}
function renderEnded(){
 const isDone=Boolean(st.ended),panel=$("#exerciseEnded");
 if(panel){panel.hidden=!isDone;$("#exerciseEndTime").textContent=isDone?"Endzeit "+(st.endedAt||stamp()):""}const participantEnd=$("#participantEnded");if(participantEnd){participantEnd.hidden=!isDone;$("#participantEndTime").textContent=isDone?"Endzeit "+(st.endedAt||stamp()):""}
 document.body.classList.toggle("exercise-finished",isDone);
 if(isDone){$("#startClock").textContent="Beendet";$("#participantSceneTitle").textContent="Einsatz beendet";}renderSyncedClock();
}
function signalCueFlash(){
 const signal=st.cueSignal,el=$("#cueReadout");
 if(!signal||!el||signal.id===lastSeenCue||st.ended)return;
 lastSeenCue=signal.id;
 if(Date.now()-Number(signal.at)>4000)return;
 el.classList.remove("cue-flash");void el.offsetWidth;el.classList.add("cue-flash");
 clearTimeout(flashTimer);
 flashTimer=setTimeout(()=>el.classList.remove("cue-flash"),3000);
}
const osm={version:8,sources:{osm:{type:"raster",tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256,attribution:"© OpenStreetMap"}},layers:[{id:"osm",type:"raster",source:"osm"}]};
function setupMap(){if(map){map.resize();renderMarkers();ensureWildfireLayers();return}if(!window.maplibregl){toast("Kartenbibliothek konnte nicht geladen werden",true);return}
map=new maplibregl.Map({container:"map",style:osm,center:st.mapCenter,zoom:st.mapZoom,attributionControl:true});map.on("error",e=>{const msg=String(e.error?.message||"");if(/401|403|forbidden|unauthorized/i.test(msg)&&st.mapStyle!=="osm"){st.mapStyle="osm";$("#mapStyle").value="osm";map.setStyle(osm);toast("MapTiler-Karte konnte nicht geladen werden. OpenStreetMap wurde aktiviert.",true)}});map.addControl(new maplibregl.NavigationControl(),"top-right");map.on("load",()=>{map.resize();renderMarkers();renderHydrants();ensureWildfireLayers()});map.on("style.load",()=>{renderMarkers();renderHydrants();ensureWildfireLayers()});map.on("moveend",()=>{if(isViewer||reviewSnapshot)return;st.mapCenter=[map.getCenter().lng,map.getCenter().lat];st.mapZoom=map.getZoom();persist()});map.on("zoomend",()=>renderMarkers());
map.on("click",e=>{if(isViewer||st.ended||!tool||reviewSnapshot)return;if(tool==="wildfire"){const fire={id:uid(),label:$("#wfName").value.trim()||"Flächenbrand",fuel:$("#wfFuel").value,lat:e.lngLat.lat,lon:e.lngLat.lng,windFrom:st.windDir||"N",windBft:st.windSpeed||0,minutes:0,lastClockSecond:currentSeconds(),lastLoggedMinute:0,status:"active",auto:$("#wfFollowClock").checked,speedFactor:Number($("#wfSpeed")?.value)||1,moisturePct:Number($("#wfMoisture").value),midflameWind:Number($("#wfMidflame").value),slopeDegrees:Number($("#wfSlope").value)};if(!Array.isArray(st.wildfires))st.wildfires=[];st.wildfires.push(fire);tool="";$("#map").classList.remove("wildfire-pick-mode");log("Flächenbrand","Brandausbruch festgelegt: "+fire.label);renderWildfireUI();ensureWildfireLayers();persist();toast("Brandherd gesetzt.");return}const selected=tool.startsWith("vehicle:")?st.vehicles.find(x=>x.id===tool.slice(8)):null;const catalog=tool==="catalog"?catalogSelection():null;const type=selected||catalog?.kind==="fahrzeug"?"fahrzeug":catalog?.kind||tool;const org=selected?.org||catalog?.org||"fw";const vehicleType=selected?.type||catalog?.type||"";const radio=selected?.radio||((catalog?.kind==="fahrzeug")?$("#tacticCallsign").value.trim():"");const crew=selected?.crew||((catalog?.kind==="fahrzeug")?$("#tacticCrew").value.trim():"");const label=selected||catalog?(vehicleType+(radio?" · "+radio:"")):"";st.objects.push({id:uid(),type,lat:e.lngLat.lat,lon:e.lngLat.lng,org,vehicleType,radio,crew,size:1,rotation:0,label:label||catalog?.type||""});tool="";renderTools();renderMarkers();log("Lagekarte",type+" platziert");persist()});
const key=localStorage.getItem("planspiel-maptiler-key")||localStorage.getItem("taktikplatte-maptiler-key")||"";if(key){$("#mapKey").value=key;if(st.mapStyle==="osm"&&!st.mapStyleSelected)st.mapStyle="satellite"}$("#mapStyle").value=st.mapStyle;$("#hydrantToggle").classList.toggle("active",Boolean(st.hydrantsVisible));setMapStyle();requestAnimationFrame(()=>map.resize())}
function setMapStyle(){if(!map)return;const style=st.mapStyle,key=$("#mapKey").value.trim();if(style==="osm")return map.setStyle(osm);if(!key){toast("MapTiler-Schlüssel fehlt. OpenStreetMap bleibt aktiv.",true);return}map.setStyle("https://api.maptiler.com/maps/"+(style==="satellite"?"satellite":"streets-v2")+"/style.json?key="+encodeURIComponent(key))}
$("#mapStyle").onchange=e=>{st.mapStyle=e.target.value;st.mapStyleSelected=true;setMapStyle();persist()};$("#mapKey").onchange=e=>{localStorage.setItem("planspiel-maptiler-key",e.target.value.trim());setMapStyle();persist()};
function catalogSelection(){
 const org=$("#tacticOrganisation").value,category=$("#tacticCategory").value,choice=$("#tacticSymbol").value;
 const items=tacticCatalog[org]?.categories[category]||[];
 const type=items[Number(choice)]||items[0]||"LF 10";
 return {org,type,kind:tacticalKinds[type]||"fahrzeug"};
}
function renderCatalog(preserve=true){
 const org=$("#tacticOrganisation").value||"fw",categories=Object.keys(tacticCatalog[org]?.categories||{});
 const cat=$("#tacticCategory"),oldCat=cat.value;
 cat.innerHTML=categories.map(x=>'<option value="'+safe(x)+'">'+safe(x)+'</option>').join("");
 if(preserve&&categories.includes(oldCat))cat.value=oldCat;
 const entries=tacticCatalog[org]?.categories[cat.value]||[],list=$("#tacticSymbol"),oldItem=list.value;
 list.innerHTML=entries.map((x,i)=>'<option value="'+i+'">'+safe(x)+'</option>').join("");
 if(preserve&&Number(oldItem)<entries.length)list.value=oldItem;
 renderCatalogPreview();
}
function renderCatalogChoices(){
 const org=$("#tacticOrganisation").value||"fw",types=tacticCatalog[org]?.categories[$("#tacticCategory").value]||[],el=$("#tacticSymbol"),prev=el.value;
 el.innerHTML=types.map((x,i)=>'<option value="'+i+'">'+safe(x)+'</option>').join("");
 if(Number(prev)<types.length)el.value=prev;
 renderCatalogPreview();
}
function renderCatalogPreview(){
 const sel=catalogSelection();
 $("#tacticPreviewSymbol").innerHTML=sel.kind==="fahrzeug"?tacticalVehicleSvg(sel.type,sel.org):tacticalSceneSvg(sel.kind,sel.type);
 $("#tacticPreviewName").textContent=sel.type;
}
$("#tacticOrganisation").onchange=()=>renderCatalog(false);
$("#tacticCategory").onchange=renderCatalogChoices;
$("#tacticSymbol").onchange=renderCatalogPreview;
$("#tacticPlace").onclick=()=>{
 if(isViewer||st.ended)return toast("Die Bearbeitung ist nicht möglich.",true);
 const sel=catalogSelection();
 tool="catalog";renderTools();toast(sel.type+" ausgewählt. Jetzt die Position auf der Karte anklicken.");
};
function renderTools(){
 const vehicles=$("#vehicleTools");
 vehicles.innerHTML=st.vehicles.map(v=>'<button type="button" data-vehicle="'+safe(v.id)+'" class="vehicle-tool '+(tool==="vehicle:"+v.id?"selected":"")+'">'+tacticalVehicleSvg(v.type,v.org||"fw",true)+'<span><strong>'+safe(v.type||"Fahrzeug")+'</strong><small>'+safe(v.radio||"Ohne Funkrufname")+'</small></span></button>').join("")||'<p class="helper">In Schritt 1 wurden noch keine Fahrzeuge festgelegt.</p>';
 $$("[data-vehicle]").forEach(b=>b.onclick=()=>{tool="vehicle:"+b.dataset.vehicle;toast("Fahrzeug auf Karte setzen: "+(st.vehicles.find(v=>v.id===b.dataset.vehicle)?.type||"Fahrzeug"))});
 $("#toolkit").innerHTML=kinds.filter(([k])=>k!=="fahrzeug").map(([k,label])=>'<button type="button" data-tool="'+k+'" class="symbol-tool '+(tool===k?"selected":"")+'">'+tacticalSceneSvg(k,label,true)+'<span>'+safe(label)+'</span></button>').join("");
 $$("[data-tool]").forEach(b=>b.onclick=()=>{tool=b.dataset.tool;toast("Zeichen auf Karte positionieren")});
}
renderCatalog(false);
let reviewSnapshot=null;

/* Vegetation fire visual model: pedagogical geometry, not physical fire forecasting. */
const wildfireFuel={grass:{label:"Gras",speed:5.0},crop:{label:"Getreide",speed:7.0},heath:{label:"Heide",speed:4.0},forest:{label:"Wald",speed:2.0}};
function selectedWildfire(){
 const id=$("#wfSelect")?.value,all=st.wildfires||[];
 return all.find(x=>x.id===id)||all.at(-1)||null;
}
/* Basic Rothermel 1972 single dead fuel class, including Albini 1976
 modifications, as described by Andrews 2018 RMRS-GTR-371 pp. 8-10.
 Illustrative stand fuel proxies: not validated for real incident use. */
const wildfireFuelParameters={
 grass:{fuelModel:"1 (vereinfachtes Gras)",tonsAcre:.74,depthFt:1,sav:3500,moistureExt:.12},
 crop:{fuelModel:"3 (vereinfachtes Gras)",tonsAcre:3,depthFt:2.5,sav:1500,moistureExt:.25},
 heath:{fuelModel:"5 (nur 1-h-Anteil)",tonsAcre:1,depthFt:2,sav:2000,moistureExt:.20},
 forest:{fuelModel:"8 (nur 1-h-Anteil)",tonsAcre:1.5,depthFt:.2,sav:2000,moistureExt:.30}
};
function rothermelBasicRate(f){
 const p=wildfireFuelParameters[f.fuel]||wildfireFuelParameters.forest;
 const sigma=p.sav,w0=p.tonsAcre*2000/43560,depth=p.depthFt;
 const bulk=w0/depth,beta=bulk/32,betaOpt=3.348*Math.pow(sigma,-.8189);
 const relative=beta/betaOpt,A=133*Math.pow(sigma,-.7913);
 const gammaMax=Math.pow(sigma,1.5)/(495+.0594*Math.pow(sigma,1.5));
 const gamma=gammaMax*Math.pow(relative,A)*Math.exp(A*(1-relative));
 const moisture=Math.max(0,Math.min(1,Number(f.moisturePct??12)/100));
 const r=Math.min(1,moisture/p.moistureExt);
 if(r>=1)return 0;
 const etaM=Math.max(0,1-2.59*r+5.11*r*r-3.52*r*r*r);
 const etaS=Math.min(1,.174*Math.pow(.01,-.19));
 const intensity=gamma*w0*(1-.0555)*8000*etaM*etaS;
 const flux=Math.exp((.792+.681*Math.sqrt(sigma))*(beta+.1))/(192+.2595*sigma);
 const epsilon=Math.exp(-138/sigma),qig=250+1116*moisture;
 const u=Math.max(0,Math.min(20,Number(f.midflameWind??.3)))*196.850394;
 const C=7.47*Math.exp(-.133*Math.pow(sigma,.55));
 const B=.02526*Math.pow(sigma,.54),E=.715*Math.exp(-.000359*sigma);
 const phiWind=C*Math.pow(u,B)*Math.pow(relative,-E);
 const rad=Math.max(0,Math.min(45,Number(f.slopeDegrees)||0))*Math.PI/180;
 const phiSlope=5.275*Math.pow(beta,-.3)*Math.pow(Math.tan(rad),2);
 const feetPerMinute=intensity*flux*(1+phiWind+phiSlope)/(bulk*epsilon*qig);
 return Number.isFinite(feetPerMinute)?Math.max(0,feetPerMinute*.3048):0;
}
function normalizeWildfire(f){
 if(!f)return null;
 // Migrate earlier scenario saves with excessive 30x–300x default.
 if(!Number.isFinite(Number(f.speedFactor))||Number(f.speedFactor)>5||Number(f.speedFactor)<=0)f.speedFactor=1;
 if(!Number.isFinite(Number(f.moisturePct)))f.moisturePct=8;
 if(!Number.isFinite(Number(f.midflameWind)))f.midflameWind=.3;
 if(!Number.isFinite(Number(f.slopeDegrees)))f.slopeDegrees=0;
 return f;
}


/* Visual wildfire artwork (custom SVG textures). Didactic illustration, NOT an operational fire model. */
const wildfireArtwork=[
 ["wildfire-flame","./assets/wildfire-flame.svg"],
 ["wildfire-smoke","./assets/wildfire-smoke.svg"],
 ["wildfire-scorch","./assets/wildfire-scorch.svg"]
];
const wildfireArtworkCache=new Map();
function registerWildfireArtwork(){
 if(!map||!map.isStyleLoaded?.())return;
 for(const [name,url] of wildfireArtwork){
  try{
   if(map.hasImage?.(name))continue;
   let img=wildfireArtworkCache.get(name);
   if(img?.complete&&img.naturalWidth){
    map.addImage(name,img,{pixelRatio:2});
    continue;
   }
   if(img)continue;
   img=new Image();wildfireArtworkCache.set(name,img);
   img.onload=()=>{
    try{
     if(map?.isStyleLoaded?.()&&!map.hasImage(name)){
      map.addImage(name,img,{pixelRatio:2});
      ensureWildfireLayers();
     }
    }catch(e){console.warn("Waldbrandbild konnte nicht eingebunden werden:",name,e)}
   };
   img.onerror=()=>console.warn("Waldbrandgrafik nicht erreichbar:",url);
   img.src=url;
  }catch(e){console.warn("Waldbrandgrafik:",name,e)}
 }
}
function wildfireArea(fire){
 const time=Math.max(0,Math.min(180,Number(fire.minutes)||0));
 const speed=rothermelBasicRate(normalizeWildfire(fire));
 const front=5+time*speed,back=4+time*speed*.16,flank=4+time*speed*.36;
 const direction=windToDegrees(fire.windFrom||st.windDir),a=direction*Math.PI/180;
 const centerShift=(front-back)/2,half=(front+back)/2;
 const seed=Array.from(String(fire.id||"fire")).reduce((x,c)=>(x+c.charCodeAt(0))%97,0)*.081;
 const points=[];
 for(let i=0;i<=96;i++){
  const t=2*Math.PI*i/96;
  // Smooth, deterministic front irregularity: no random jitter on repeated renders.
  const ripples=1+.055*Math.sin(7*t+seed)+.035*Math.sin(13*t+seed*2);
  const along=centerShift+half*Math.cos(t)*ripples,lateral=flank*Math.sin(t)*ripples;
  const east=Math.sin(a)*along+Math.cos(a)*lateral,north=Math.cos(a)*along-Math.sin(a)*lateral;
  points.push([fire.lon+east/(111320*Math.max(.1,Math.cos(fire.lat*Math.PI/180))),fire.lat+north/111320]);
 }
 return {coordinates:points,front,back,flank,speed};
}
function wildfireFrontFeatures(){
 const fires=reviewSnapshot?.wildfires||st.wildfires||[];
 return {type:"FeatureCollection",features:fires.filter(f=>f.status!=="extinguished").map(f=>{
  const g=wildfireArea(f);
  // The fire head is the downwind-facing arc of the perimeter.
  const seg=g.coordinates.slice(-17).concat(g.coordinates.slice(1,18));
  return {type:"Feature",properties:{label:f.label||"Brandfront",status:f.status||"active"},geometry:{type:"LineString",coordinates:seg}};
 })};
}
function wildfireFeatures(){
 const fires=reviewSnapshot?.wildfires||st.wildfires||[];
 return {type:"FeatureCollection",features:fires.filter(f=>Number.isFinite(Number(f.lat))&&Number.isFinite(Number(f.lon))).map(f=>{
  const geometry=wildfireArea(f);
  return {type:"Feature",properties:{id:f.id,label:f.label||"Flächenbrand",status:f.status||"active",fuel:f.fuel,minutes:Number(f.minutes)||0},geometry:{type:"Polygon",coordinates:[geometry.coordinates]}};
 })};
}
function wildfireSpriteFeatures(){
 const fires=reviewSnapshot?.wildfires||st.wildfires||[],features=[];
 for(const f of fires){
  if(f.status==="extinguished")continue;
  const g=wildfireArea(f),points=g.coordinates,mins=Math.max(0,Number(f.minutes)||0);
  const intensity=Math.min(1.45,.35+Math.sqrt(mins)*.19);
  const flameIndices=[0,5,11,19,77,85,91];
  for(let i=0;i<flameIndices.length;i++){
   const index=flameIndices[i],point=points[index];
   features.push({type:"Feature",properties:{sprite:"wildfire-flame",scale:intensity*(i===0?1.2:i===3||i===4?.56:.8)},geometry:{type:"Point",coordinates:point}});
  }
  // Smoke drifts downwind; use dispersed, overlapping image sprites.
  const a=windToDegrees(f.windFrom||st.windDir)*Math.PI/180;
  for(let i=0;i<6;i++){
   const at=points[[0,4,10,86,92,96][i]],drift=(10+i*5+Math.sqrt(mins)*6);
   const east=drift*Math.sin(a),north=drift*Math.cos(a);
   features.push({type:"Feature",properties:{sprite:"wildfire-smoke",scale:Math.min(1.45,.43+Math.sqrt(mins)*.12)*(i%3===0?1.2:1)},geometry:{type:"Point",coordinates:[at[0]+east/(111320*Math.max(.1,Math.cos(f.lat*Math.PI/180))),at[1]+north/111320]}});
  }
 }
 return {type:"FeatureCollection",features};
}
function ensureWildfireLayers(){
 if(!map||!map.isStyleLoaded?.())return;
 const legend=$("#wildfireLegend");if(legend)legend.hidden=!(reviewSnapshot?.wildfires||st.wildfires||[]).length;
 try{
  registerWildfireArtwork();
  if(!map.getSource("planspiel-wildfire")){
   map.addSource("planspiel-wildfire",{type:"geojson",data:wildfireFeatures()});
   map.addLayer({id:"planspiel-wildfire-fill",type:"fill",source:"planspiel-wildfire",paint:{"fill-color":["match",["get","status"],"extinguished","#252523","stopped","#422b22","#472a22"],"fill-opacity":["match",["get","status"],"extinguished",.6,.73]}});
   map.addLayer({id:"planspiel-wildfire-glow",type:"line",source:"planspiel-wildfire",paint:{"line-color":["match",["get","status"],"extinguished","#4b5048","stopped","#e8882b","#f24e12"],"line-width":16,"line-blur":7,"line-opacity":["match",["get","status"],"extinguished",0,.6]}});
   map.addLayer({id:"planspiel-wildfire-edge",type:"line",source:"planspiel-wildfire",paint:{"line-color":["match",["get","status"],"extinguished","#6b6759","stopped","#e0a047","#fc6d22"],"line-width":["match",["get","status"],"extinguished",2,3],"line-opacity":.88}});
   map.addSource("planspiel-wildfire-front",{type:"geojson",data:wildfireFrontFeatures()});
   map.addLayer({id:"planspiel-wildfire-head-glow",type:"line",source:"planspiel-wildfire-front",paint:{"line-color":"#ff6816","line-width":17,"line-blur":7,"line-opacity":["match",["get","status"],"stopped",.13,.68]}});
   map.addLayer({id:"planspiel-wildfire-head",type:"line",source:"planspiel-wildfire-front",paint:{"line-color":["match",["get","status"],"stopped","#f3ac55","#fff18f"],"line-width":4,"line-opacity":.97}});
   map.addSource("planspiel-wildfire-sprites",{type:"geojson",data:wildfireSpriteFeatures()});
  }
  if(map.hasImage?.("wildfire-scorch")&&!map.getLayer("planspiel-wildfire-texture"))
   map.addLayer({id:"planspiel-wildfire-texture",type:"fill",source:"planspiel-wildfire",paint:{"fill-pattern":"wildfire-scorch","fill-opacity":.54}}, "planspiel-wildfire-glow");
  if(map.hasImage?.("wildfire-flame")&&map.hasImage?.("wildfire-smoke")&&!map.getLayer("planspiel-wildfire-artwork"))
   map.addLayer({id:"planspiel-wildfire-artwork",type:"symbol",source:"planspiel-wildfire-sprites",layout:{"icon-image":["get","sprite"],"icon-size":["get","scale"],"icon-anchor":"center","icon-allow-overlap":true,"icon-ignore-placement":true},paint:{"icon-opacity":["match",["get","sprite"],"wildfire-smoke",.65,.94]}});
  map.getSource("planspiel-wildfire")?.setData(wildfireFeatures());
  map.getSource("planspiel-wildfire-front")?.setData(wildfireFrontFeatures());
  map.getSource("planspiel-wildfire-sprites")?.setData(wildfireSpriteFeatures());
 }catch(e){console.warn("Flächenbrandgrafik:",e)}
}
function renderWildfireUI(){
 if(isViewer||!$("#wfSelect"))return;
 const select=$("#wfSelect"),saved=select.value;
 const fires=st.wildfires||[];
 select.innerHTML=fires.length?fires.map(f=>'<option value="'+safe(f.id)+'">'+safe(f.label||"Flächenbrand")+' · '+safe(wildfireFuel[f.fuel]?.label||f.fuel)+'</option>').join(""):'<option value="">Noch kein Brandherd</option>';
 if(fires.some(f=>f.id===saved))select.value=saved;
 else if(fires.length)select.value=fires[fires.length-1].id;
 const fire=selectedWildfire(),locked=!fire||st.ended;if(fire)normalizeWildfire(fire);
 for(const id of ["wfStepOne","wfStepFive"])$(id).disabled=locked||(fire?.status!=="active");$("#wfUpdateWind").disabled=locked;$("#wfStop").disabled=locked||(fire?.status==="extinguished");$("#wfExtinguish").disabled=locked||(fire?.status==="extinguished");$("#wfStop").textContent=fire?.status==="stopped"?"Ausbreitung fortsetzen":"Ausbreitung stoppen";
 $("#wfFollowClock").disabled=locked;
 $("#wfFollowClock").checked=!!fire?.auto;if($("#wfSpeed")){$("#wfSpeed").value=String(fire?.speedFactor||1);$("#wfSpeed").disabled=locked;}for(const [id,key,def] of [["wfMoisture","moisturePct",8],["wfMidflame","midflameWind",.3],["wfSlope","slopeDegrees",0]]){const x=$("#"+id);if(x){x.disabled=locked;x.value=String(fire?.[key]??def)}}$("#wfStop").dataset.stopped=String(fire?.status==="stopped");
 if(fire){
  const geo=wildfireArea(fire),area=Math.PI*(geo.front+geo.back)/2*geo.flank/10000;
  $("#wfStatus").textContent=(fire.status==="extinguished"?"Gelöscht":fire.status==="stopped"?"Ausbreitung angehalten":"Brandentwicklung aktiv")+" · "+Number(fire.minutes||0).toFixed(2).replace(".",",")+" simulierte Minuten · Fläche ca. "+area.toFixed(2).replace(".",",")+" ha · Kopf ca. "+Math.round(geo.front)+" m · Rücken ca. "+Math.round(geo.back)+" m · Flankenbreite ca. "+Math.round(geo.flank*2)+" m · Tempo ca. "+geo.speed.toFixed(1).replace(".",",")+" m/Übungsminute · Wind aus "+(fire.windFrom||"N")+" ("+fire.windBft+" Bft) · Modellwerte (nicht für Einsatztaktik geeignet)";
 }else $("#wfStatus").textContent="Erst einen Bewuchs wählen und den Brandausbruch per Kartenklick setzen.";
}
function updateWildfire(minutes,reason){
 const fire=selectedWildfire();
 if(!st.started)return toast("Bitte zuerst den Übungsdurchlauf starten.",true);
 if(st.ended||!fire||fire.status!=="active")return;
 fire.minutes=Math.min(180,(Number(fire.minutes)||0)+minutes);
 fire.lastClockSecond=currentSeconds();
 log("Flächenbrand",reason+" · "+fire.label+" · "+fire.minutes+" Minuten");
 renderWildfireUI();ensureWildfireLayers();persist();
}
if($("#wfIgnite")) $("#wfIgnite").onclick=()=>{
 if(st.ended)return toast("Einsatz bereits beendet.",true);
 tool="wildfire";$("#map").classList.add("wildfire-pick-mode");
 toast("Auf der Karte auf den Brandausbruch klicken.");
};
if($("#wfSelect")) $("#wfSelect").onchange=renderWildfireUI;
if($("#wfStepOne")) $("#wfStepOne").onclick=()=>updateWildfire(1,"Ausbreitung");
if($("#wfStepFive")) $("#wfStepFive").onclick=()=>updateWildfire(5,"Ausbreitung");
if($("#wfUpdateWind")) $("#wfUpdateWind").onclick=()=>{const f=selectedWildfire();if(!f||st.ended)return;f.windFrom=st.windDir||"N";f.windBft=Number(st.windSpeed)||0;log("Flächenbrand","Windbedingungen aktualisiert: "+f.windFrom+" / "+f.windBft+" Bft");renderWildfireUI();ensureWildfireLayers();persist()};
if($("#wfStop")) $("#wfStop").onclick=()=>{
 const fire=selectedWildfire();if(!fire||st.ended)return;
 if(fire.status==="extinguished")return;
 if(fire.status==="stopped"){fire.status="active";fire.auto=fire.autoBeforeStop!==false;toast("Ausbreitung fortgesetzt");}
 else{fire.autoBeforeStop=fire.auto!==false;fire.status="stopped";fire.auto=false;toast("Ausbreitung gestoppt");}
 fire.lastClockSecond=currentSeconds();
 log("Flächenbrand",(fire.status==="stopped"?"Ausbreitung angehalten: ":"Ausbreitung fortgesetzt: ")+fire.label);
 renderWildfireUI();ensureWildfireLayers();persist();
};
if($("#wfExtinguish")) $("#wfExtinguish").onclick=()=>{
 const fire=selectedWildfire();if(!fire||st.ended)return;
 fire.status="extinguished";fire.auto=false;
 log("Flächenbrand","Als gelöscht markiert: "+fire.label);
 renderWildfireUI();ensureWildfireLayers();persist();
};
if($("#wfSpeed")) $("#wfSpeed").onchange=e=>{const f=selectedWildfire();if(!f||st.ended)return;f.speedFactor=Number(e.target.value)||1;f.lastClockSecond=currentSeconds();renderWildfireUI();persist()};
for(const [id,key,min,max] of [["wfMoisture","moisturePct",0,100],["wfMidflame","midflameWind",0,20],["wfSlope","slopeDegrees",0,45]]){const input=$("#"+id);if(input)input.onchange=()=>{const f=selectedWildfire();if(!f||st.ended)return;const v=Number(input.value);if(!Number.isFinite(v))return toast("Ungültiger Wert",true);f[key]=Math.max(min,Math.min(max,v));f.lastClockSecond=currentSeconds();renderWildfireUI();ensureWildfireLayers();persist()}};
if($("#wfFollowClock")) $("#wfFollowClock").onchange=e=>{
 const fire=selectedWildfire();if(!fire||st.ended)return;
 fire.auto=e.target.checked;fire.lastClockSecond=currentSeconds();
 renderWildfireUI();persist();
};
function tickWildfires(){
 if(!st.started||st.ended||!st.clockRunning)return;
 const now=currentSeconds();let changed=false,record=false;
 for(const f of st.wildfires||[]){
  if(!f.auto||f.status!=="active")continue;
  const last=Number.isFinite(Number(f.lastClockSecond))?Number(f.lastClockSecond):now;
  const dt=Math.max(0,Math.min(4,now-last));
  f.lastClockSecond=now;
  if(!dt)continue;
  f.minutes=Math.min(180,(Number(f.minutes)||0)+(dt/60)*(Number(f.speedFactor)||1));
  changed=true;
  const full=Math.floor(f.minutes);
  if(full>Math.floor(Number(f.lastLoggedMinute)||0)){
   f.lastLoggedMinute=full;record=true;
  }
 }
 if(changed){
  ensureWildfireLayers();
  renderWildfireUI();
  if(record)log("Flächenbrand","Automatische Flächenausbreitung");
 }
}

function renderMarkers(override){
 if(!map)return;ensureWildfireLayers();markers.forEach(m=>m.remove());markers=[];
 const objects=override||reviewSnapshot?.objects||st.objects;
 for(const obj of objects){
  if(isViewer&&obj.hiddenToViewer)continue;
  const el=document.createElement("button");el.className="map-pin";if(obj.type==="fahrzeug")el.classList.add("vehicle-marker");if(obj.type==="brand")el.classList.add("brand-marker");el.type="button";
  const vehicleLength=/DLK|DLA|TM|TLF 4000|GRTW/.test(String(obj.vehicleType||""))?10:/MTF|MTW|KdoW|NEF/.test(String(obj.vehicleType||""))?5.5:/RTW|KTW/.test(String(obj.vehicleType||""))?7:8.2;
  const metersPerPixel=156543.03392*Math.cos(obj.lat*Math.PI/180)/Math.pow(2,map.getZoom());
  const px=obj.type==="fahrzeug"?Math.max(30,Math.min(96,Math.round(vehicleLength/metersPerPixel))):obj.type==="brand"?46:30;
  const symbol=obj.type==="fahrzeug"?tacticalVehicleSvg(obj.vehicleType||obj.label||"FW",obj.org||"fw",true):tacticalSceneSvg(obj.type,obj.label||obj.type,true);
  el.innerHTML='<span class="pin-graphic" style="display:inline-flex;transform:rotate('+Number(obj.rotation||0)+'deg)">'+symbol+'</span>'+(obj.label?'<span>'+safe(obj.label)+'</span>':"");
  el.querySelector("svg")?.setAttribute("width",String(Math.max(26,Math.round(px*(obj.size||1)))));
  el.querySelector("svg")?.setAttribute("height",String(Math.max(26,Math.round(px*(obj.size||1)*(obj.type==="fahrzeug"?.85:1)))));
  const effectCue=reviewSnapshot?.cue||st.activeCue;const intensity=obj.type==="brand"?Number(effectCue?.fire||0):obj.type==="rauch"?Number(effectCue?.smoke||0):0;
  if(intensity>0){
   el.classList.add(obj.type==="brand"?"fire-active":"smoke-active");
   if(obj.type==="brand")el.classList.add("affected-fire");
   if(obj.type==="rauch")el.classList.add("affected-smoke");
   const v=el.querySelector("svg");
   if(v){v.setAttribute("width",String(Math.min(95,Number(v.getAttribute("width"))*(1+intensity*.23))));v.setAttribute("height",String(Math.min(95,Number(v.getAttribute("height"))*(1+intensity*.23))))}
   if(obj.type==="brand"||obj.type==="rauch"){
    const plume=document.createElement("span");
    plume.className="effect-fume";
    plume.style.width=(35+intensity*26)+"px";
    plume.style.height=(18+intensity*11)+"px";
    plume.style.transform="rotate("+windToDegrees(st.windDir)+"deg)";
    plume.style.background=obj.type==="rauch"?"linear-gradient(90deg,#5d6974b3,#8797a768,transparent)":"linear-gradient(90deg,#ed622980,#ef933433,transparent)";
    el.appendChild(plume);
   }
  }
  el.title=(obj.label||obj.type)+" · "+(isViewer?"Einsatzdarstellung":"bearbeiten, drehen oder entfernen");
  const marker=new maplibregl.Marker({element:el,draggable:!isViewer&&!reviewSnapshot,anchor:"center"}).setLngLat([obj.lon,obj.lat]).addTo(map);
  if(!isViewer&&!reviewSnapshot&&!st.ended){
   const popup=document.createElement("div");popup.className="marker-edit";
   popup.innerHTML='<strong>'+safe(obj.label||obj.type)+'</strong><div><button type="button" data-rot="-15">↶ 15°</button><button type="button" data-rot="15">↷ 15°</button><button type="button" data-size="-0.2">− Größe</button><button type="button" data-size="0.2">+ Größe</button></div><label style="display:block;font-size:11px"><input type="checkbox" data-hide '+(obj.hiddenToViewer?"checked":"")+'> Für Teilnehmer verbergen</label><button type="button" data-delete class="danger">Entfernen</button>';
   el.onclick=e=>{e.stopPropagation();const p=new maplibregl.Popup({offset:18,closeOnClick:true,maxWidth:"250px"}).setLngLat([obj.lon,obj.lat]).setDOMContent(popup).addTo(map);
    popup.querySelectorAll("[data-rot]").forEach(b=>b.onclick=()=>{obj.rotation=((Number(obj.rotation)||0)+Number(b.dataset.rot)+360)%360;log("Symbol gedreht",obj.label||obj.type);p.remove();renderMarkers();persist()});
    popup.querySelectorAll("[data-size]").forEach(b=>b.onclick=()=>{obj.size=Math.max(.6,Math.min(3,Number((Number(obj.size||1)+Number(b.dataset.size)).toFixed(2))));log("Symbolgröße",obj.label||obj.type);p.remove();renderMarkers();persist()});
    popup.querySelector("[data-hide]").onchange=e=>{obj.hiddenToViewer=e.target.checked;log("Sichtbarkeit",obj.label||obj.type);persist()};
    popup.querySelector("[data-delete]").onclick=()=>{if(obj.sourceVehicleId){st.vehicleMapRemoved=st.vehicleMapRemoved||[];if(!st.vehicleMapRemoved.includes(obj.sourceVehicleId))st.vehicleMapRemoved.push(obj.sourceVehicleId)}st.objects=st.objects.filter(x=>x.id!==obj.id);log("Symbol entfernt",obj.label||obj.type);p.remove();renderMarkers();persist()}
   };
   marker.on("dragend",()=>{const p=marker.getLngLat();obj.lon=p.lng;obj.lat=p.lat;log("Fahrzeug/Symbol verschoben",obj.label||obj.type);persist()});
  }
  markers.push(marker)
 }
}

/* Exercise replay is local to the instructor. Never sync review frames to the viewer. */
let replayIndex=-1,replayTimer=null;
function replayItems(){return st.started&&Array.isArray(st.history)?st.history.filter(x=>x.type!=="Teilnehmerfreigabe"):[]}
function stopReplay(){if(replayTimer){clearInterval(replayTimer);replayTimer=null}const b=$("#replayStart");if(b)b.textContent="▶ Abspielen"}
function showReplayFrame(index){
 const frames=replayItems();if(!frames.length)return;
 replayIndex=Math.max(0,Math.min(index,frames.length-1));
 reviewSnapshot=frames[replayIndex];
 if(map){renderMarkers();if(Array.isArray(reviewSnapshot.center))map.jumpTo({center:reviewSnapshot.center,zoom:reviewSnapshot.zoom??st.mapZoom})}
 $("#returnLive").hidden=false;updateReplayUI();
}
function updateReplayUI(){
 if(isViewer)return;
 const frames=replayItems(),len=frames.length,range=$("#replaySlider");
 if(!range)return;
 range.max=String(Math.max(0,len-1));range.disabled=len<1;
 range.value=String(Math.max(0,Math.min(replayIndex<0?len-1:replayIndex,len-1)));
 $("#replayStart").disabled=len<2;$("#replayPrev").disabled=len<1;$("#replayNext").disabled=len<1;
 $("#replayLive").disabled=!reviewSnapshot;
 $("#replayStatus").textContent=len?(reviewSnapshot?"Rückschau · Zustand "+(replayIndex+1)+" von "+len:len+" Lagezustände gespeichert"):"Noch kein Übungsdurchlauf aufgezeichnet";
 $("#replayPosition").textContent=reviewSnapshot?.time||frames.at(-1)?.time||"00:00:00";
}
function restoreLiveMap(){
 stopReplay();reviewSnapshot=null;replayIndex=-1;
 if(map){map.jumpTo({center:st.mapCenter,zoom:st.mapZoom});renderMarkers()}
 $("#returnLive").hidden=true;updateReplayUI();
}
$("#replaySlider").oninput=e=>{stopReplay();showReplayFrame(+e.target.value)};
$("#replayPrev").onclick=()=>{stopReplay();showReplayFrame(Math.max(0,replayIndex-1))};
$("#replayNext").onclick=()=>{stopReplay();showReplayFrame(replayIndex<0?0:replayIndex+1)};
$("#replayLive").onclick=restoreLiveMap;
$("#replayStart").onclick=()=>{
 const frames=replayItems();if(frames.length<2)return;
 if(replayTimer){stopReplay();return}
 if(replayIndex<0||replayIndex>=frames.length-1)showReplayFrame(0);
 $("#replayStart").textContent="Ⅱ Pause";
 replayTimer=setInterval(()=>{
  if(replayIndex>=replayItems().length-1){stopReplay();return}
  showReplayFrame(replayIndex+1)
 },1200)
};
const windDegrees={N:0,NO:45,O:90,SO:135,S:180,SW:225,W:270,NW:315};
function windToDegrees(dir){return (windDegrees[dir]??0)+180}
const beaufortDescriptions=["Windstille","leiser Zug","leichte Brise","schwache Brise","mäßige Brise","frische Brise","starker Wind","steifer Wind","stürmischer Wind","Sturm","schwerer Sturm","orkanartiger Sturm","Orkan"];
function beaufortDescription(bft){const n=Number(bft);return bft==null||bft===""||!Number.isInteger(n)||n<0||n>12?"Windstärke nicht festgelegt":n+" Bft · "+beaufortDescriptions[n]}
function renderWind(){
 const dir=st.windDir||"",strength=st.windSpeed;
 const a=$("#windArrow");if(a)a.style.transform="rotate("+windToDegrees(dir)+"deg)";
 $("#windMapDirection").textContent=dir?"Wind aus "+dir:"Windrichtung nicht festgelegt";
 $("#windMapSpeed").textContent=beaufortDescription(strength);
}

function renderHistory(){
 const host=$("#historyItems");if(!host||isViewer)return;
 const items=st.started&&Array.isArray(st.history)?st.history.filter(x=>x.type!=="Teilnehmerfreigabe"):[];
 host.innerHTML=items.length?[...items].reverse().map(x=>'<div class="history-line"><time>'+safe(x.time)+'</time><strong>'+safe(x.type)+'</strong><div>'+safe(x.detail)+'</div><button data-review="'+safe(x.id)+'">Lagezustand anzeigen</button></div>').join(""):'<p class="helper">'+(st.started?'Noch keine dokumentierten Lageänderungen.':'Die Dokumentation beginnt mit dem Start des Übungsdurchlaufs.')+'</p>';
 host.querySelectorAll("[data-review]").forEach(btn=>btn.onclick=()=>{const index=items.findIndex(x=>x.id===btn.dataset.review);if(index>=0){stopReplay();showReplayFrame(index);toast("Historischer Lagezustand nur in der Regie angezeigt.")}});updateReplayUI();
}
function renderRadioMessages(){
 const out=$("#radioList");if(!out||isViewer)return;
 const data=Array.isArray(st.radioMessages)?st.radioMessages:[];
 out.innerHTML=data.length?[...data].reverse().map(m=>'<article class="radio-entry"><strong>'+safe(m.type)+' · '+safe(m.time)+'</strong><small>'+safe(m.sender||"Ohne Funkrufname")+'</small><p>'+safe(m.text)+'</p></article>').join(""):'<p class="helper">Noch keine Funkmeldungen erfasst.</p>';
}
$("#radioRecord").onclick=()=>{
 if(!st.started||st.ended)return toast("Funkmeldungen können nur während des laufenden Übungsdurchlaufs dokumentiert werden.",true);
 const type=$("#radioType").value,content=$("#radioText").value.trim(),sender=$("#radioSender").value.trim();
 if(!content)return toast("Bitte den Inhalt der Funkmeldung eingeben.",true);
 if(!Array.isArray(st.radioMessages))st.radioMessages=[];
 st.radioMessages.push({id:uid(),time:stamp(),type,sender,text:content});
 log("Funkmeldung · "+type,(sender?sender+": ":"")+content);
 $("#radioText").value="";renderRadioMessages();persist();toast("Funkmeldung dokumentiert");
};
function refreshReleaseViews(){
 if(!isViewer)return;
 const mapEl=$("#map"),banner=$("#mapAnnouncement");
 mapEl.classList.toggle("release-hidden",st.releaseMap===false);
 banner.hidden=st.releaseMap!==false;
 banner.textContent="Die Lagekarte wurde noch nicht durch die Übungsleitung freigegeben.";
 if(st.releaseMap!==false&&map)requestAnimationFrame(()=>map.resize())
}

function renderHydrants(){
 if(!map)return;
 hydrantMarkers.forEach(x=>x.remove());hydrantMarkers=[];
 if(!st.hydrantsVisible)return;
 for(const h of (st.hydrants||[])){
  const el=document.createElement("span");el.className="hydrant-pin";el.textContent=h.type==="pillar"?"Ü":"U";
  el.title="OSM "+(h.type==="pillar"?"Überflurhydrant":"Hydrant")+(h.diameter?" · DN "+h.diameter:"")+" · Position ungeprüft";
  const m=new maplibregl.Marker({element:el,anchor:"center"}).setLngLat([h.lon,h.lat]).addTo(map);
  hydrantMarkers.push(m)
 }
}
$("#hydrantToggle").onclick=async()=>{
 if(st.hydrantsVisible){st.hydrantsVisible=false;$("#hydrantToggle").classList.remove("active");renderHydrants();persist();return}
 if(st.hydrants?.length){st.hydrantsVisible=true;$("#hydrantToggle").classList.add("active");renderHydrants();persist();return}
 if(!map)return toast("Zuerst die Karte öffnen.",true);
 const btn=$("#hydrantToggle");btn.disabled=true;btn.textContent="Hydranten laden …";
 try{
  const b=map.getBounds();const south=Math.max(-90,b.getSouth()),north=Math.min(90,b.getNorth()),west=b.getWest(),east=b.getEast();
  if(Math.abs(east-west)>.065||Math.abs(north-south)>.065)throw Error("Bitte näher an das Einsatzobjekt heranzoomen (Zoomstufe 15 oder höher).");
  const q='[out:json][timeout:18];node["emergency"="fire_hydrant"]('+south+','+west+','+north+','+east+');out 200;';
  const res=await fetch("https://overpass.kumi.systems/api/interpreter?data="+encodeURIComponent(q));
  if(!res.ok)throw Error("OSM-Abfrage momentan nicht verfügbar (HTTP "+res.status+").");
  const json=await res.json();
  st.hydrants=(json.elements||[]).filter(o=>typeof o.lat==="number"&&typeof o.lon==="number").slice(0,200).map(o=>({lat:o.lat,lon:o.lon,type:o.tags?.["fire_hydrant:type"]||"",diameter:o.tags?.["fire_hydrant:diameter"]||""}));
  st.hydrantsVisible=true;renderHydrants();persist();
  toast(st.hydrants.length+" auf OpenStreetMap kartierte Hydranten angezeigt (Angaben ungeprüft).")
 }catch(e){toast(e.message,true)}finally{btn.disabled=false;btn.textContent="Hydranten";btn.classList.toggle("active",st.hydrantsVisible)}
};
$("#clearMap").onclick=()=>{if(confirm("Alle taktischen Zeichen von der Karte entfernen?")){st.objects=[];renderMarkers();persist()}};
$("#openViewer").onclick=()=>{storeForm();persist();window.open(location.origin+location.pathname+"?viewer=1&v=6.0","_blank")};
$("#saveBtn").onclick=()=>{storeForm();toast("Szenario im Browser gespeichert")};
$("#exportBtn").onclick=()=>{storeForm();const b=new Blob([JSON.stringify(st,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="taktikplatte-szenario.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$("#importBtn").onclick=()=>$("#importFile").click();$("#importFile").onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text());if(!Array.isArray(j.objects)||!Array.isArray(j.vehicles))throw Error("Ungültiges Szenario");st={...initial(),...migrateScenarioWind(j),step:0};go(0,true);renderTools();toast("Szenario importiert")}catch(e){toast(e.message,true)}};
function newExercise(){
 if(timer){clearInterval(timer);timer=null}stopReplay();
 st=initial();photos=[];photoIndex=0;tool="";reviewSnapshot=null;$("#map").classList.remove("wildfire-pick-mode");renderWildfireUI();ensureWildfireLayers();
 $("#timeCounter").textContent="00:00:00";$("#startClock").textContent="Start";renderSyncedClock();
 $("#exerciseEnded").hidden=true;$("#participantEnded").hidden=true;
 $("#radioText").value="";
 renderEnded();renderRadioMessages();
 document.body.classList.remove("exercise-finished");
}
$("#newBtn").onclick=()=>{if(confirm("Neues Szenario beginnen? Gespeicherte Daten können überschrieben werden.")){newExercise();go(0,true);renderTools()}};
$("#startClock").onclick=()=>{
 if(st.ended)return;
 if(st.clockRunning){
  st.clock=currentSeconds();st.clockBase=st.clock;st.clockAnchor=null;st.clockRunning=false;
  if(timer){clearInterval(timer);timer=null}
  $("#startClock").textContent="Fortsetzen";
  renderSyncedClock();persist();return;
 }
 if(!st.started){
  st.started=true;st.clock=0;st.clockBase=0;st.journal=[];st.history=[];st.radioMessages=[];
  if(Array.isArray(st.wildfires))for(const f of st.wildfires)f.lastClockSecond=0;
  stopReplay();reviewSnapshot=null;replayIndex=-1;updateReplayUI();renderRadioMessages();
  log("Übungsstart","Übungsdurchlauf durch die Planspielleitung gestartet");
 }
 st.clockBase=Number(st.clock)||0;st.clockAnchor=Date.now();st.clockRunning=true;
 if(timer)clearInterval(timer);
 timer=setInterval(()=>{
  st.clock=currentSeconds();
  renderSyncedClock();
  tickWildfires();
  triggerScheduledCues();
  persist();
 },1000);
 $("#startClock").textContent="Pause";renderSyncedClock();triggerScheduledCues();persist();
};
$("#resetClock").onclick=()=>{
 if(st.ended)return;
 st.clock=0;st.clockBase=0;
 if(Array.isArray(st.cues)){for(const c of st.cues)c.state="ready";st.activeCue=null;renderCues();renderParticipantScene()}
 if(st.clockRunning)st.clockAnchor=Date.now();
 renderSyncedClock();persist();
};
$("#endExercise").onclick=()=>{
 if(st.ended)return;
 if(!confirm("Planspiel jetzt beenden? Die Uhr und weitere Einspielungen werden gesperrt."))return;
 st.clock=currentSeconds();st.clockBase=st.clock;st.clockRunning=false;st.clockAnchor=null;
 if(timer){clearInterval(timer);timer=null}
 st.ended=true;st.endedAt=formatClock(st.clock);st.cueSignal=null;
 if(Array.isArray(st.wildfires))for(const f of st.wildfires)f.auto=false;
 renderWildfireUI();
 log("Übungsende","Planspiel durch Übungsleitung beendet");
 renderEnded();renderParticipantScene();renderSyncedClock();persist();
 toast("Einsatz beendet. Die Lage wurde abgeschlossen.");
};
$("#printBtn").onclick=()=>{if(!st.started)return toast("Die Übungsdokumentation beginnt erst mit „Start“.",true);const sec=document.createElement("section");sec.id="printContent";sec.innerHTML="<h1>TAKTIKPLATTE – Übungsprotokoll</h1><p>"+safe(st.stichwort)+" · "+safe(st.address)+"</p><p>"+safe(st.date)+" · "+safe(st.time)+" · "+safe(st.weather)+" · Wind "+safe(st.windDir)+" "+safe(bftLabel(st.windSpeed))+"</p><h2>Einsatzmittel</h2><p>"+st.vehicles.map(x=>safe(x.type)+" "+safe(x.radio)+" ("+safe(x.crew)+")").join("; ")+"</p><h2>Chronologie</h2><table>"+st.journal.filter(x=>x.type!=="Teilnehmerfreigabe").map(x=>"<tr><td>"+safe(x.time)+"</td><td>"+safe(x.type)+"</td><td>"+safe(x.detail)+"</td></tr>").join("")+"</table>";document.body.append(sec);window.print();setTimeout(()=>sec.remove(),1000)};
function viewerStart(){document.body.classList.remove("landing-mode");document.body.classList.add("viewer");st.step=3;$$(".step-content").forEach((e,i)=>e.classList.toggle("active",i===3));$("#controls").hidden=true;$("#viewerBanner").hidden=false;$("#toolkit").hidden=true;$("#vehicleTools").hidden=true;$("#directorPanel").hidden=true;$("#mapActions").hidden=true;$("#openViewer").hidden=true;$("#printBtn").hidden=true;$("#saveBtn").hidden=true;$("#exportBtn").hidden=true;$("#newBtn").hidden=true;$("#importBtn").hidden=true;renderParticipantScene();updateSummary();stepText();setupMap();renderEnded();refreshReleaseViews();renderSyncedClock();bc?.postMessage({kind:"request"})}
if(bc)bc.onmessage=e=>{if(isViewer&&e.data?.kind==="sync"){const next=e.data.state;if(st.activeGalleryId!==next.activeGalleryId)participantChosenPhoto=null;st={...initial(),...next,step:3};updateSummary();renderParticipantScene();signalCueFlash();refreshReleaseViews();renderSyncedClock();if(map){renderMarkers();renderHydrants()}}else if(!isViewer&&e.data?.kind==="request")persist()};
// A participant updates its clock from the last shared anchor even between broadcast packets.
// BroadcastChannel synchronizes separate tabs within the same browser, not remote devices.
if(isViewer)setInterval(renderSyncedClock,250);
window.addEventListener("beforeunload",persist);

function showDirectorTab(id){$$("[data-director-tab]").forEach(b=>b.classList.toggle("selected",b.dataset.directorTab===id));$$("[data-director-panel]").forEach(p=>p.classList.toggle("selected",p.dataset.directorPanel===id));if(id==="review")renderHistory();if(id==="radio")renderRadioMessages();if(id==="wildfire")renderWildfireUI()}
$$("[data-director-tab]").forEach(b=>b.onclick=()=>showDirectorTab(b.dataset.directorTab));
$("#directorAddCue").onclick=()=>go(2);
$("#logCommand").onclick=()=>{if(!st.started||st.ended)return toast("Dokumentation ist nur während des gestarteten Übungsdurchlaufs möglich.",true);const n=$("#commandNote").value.trim();if(!n)return toast("Bitte eine Notiz eingeben",true);log("Befehl / Entscheidung",n);$("#commandNote").value="";persist();toast("In der Chronologie dokumentiert")};
$("#returnLive").onclick=()=>{restoreLiveMap();toast("Aktuelle Lage wiederhergestellt")};
$("#exportProtocol").onclick=()=>$("#printBtn").click();
$("#showViewerFront").checked=st.releaseFront!==false;
$("#showViewerMap").checked=st.releaseMap!==false;
$("#showViewerFront").onchange=e=>{st.releaseFront=e.target.checked;persist()};
$("#showViewerMap").onchange=e=>{st.releaseMap=e.target.checked;persist()};

function importScenario(file){if(!file)return;file.text().then(t=>{const j=JSON.parse(t);if(!Array.isArray(j.objects)||!Array.isArray(j.vehicles))throw Error("Ungültige Szenario-Datei");st={...initial(),...migrateScenarioWind(j),step:0};document.body.classList.remove("landing-mode");go(0,true);renderTools();toast("Einsatz erfolgreich geladen")}).catch(e=>toast("Import fehlgeschlagen: "+e.message,true))}
$("#landingNew").onclick=()=>{document.body.classList.remove("landing-mode");newExercise();go(0,true);renderTools()};
$("#landingImport").onclick=()=>$("#landingFile").click();
$("#landingFile").onchange=e=>importScenario(e.target.files?.[0]);
$("#homeBtn").onclick=()=>{storeForm();persist();document.body.classList.add("landing-mode");window.scrollTo(0,0)};

try{renderTools();form();renderRadioMessages();renderWildfireUI();renderSyncedClock();renderEnded();}catch(err){console.error("TAKTIKPLATTE Initialisierung:",err);$("#timeCounter").textContent=stamp();}
if(isViewer)viewerStart();else{
 document.body.classList.add("landing-mode");$("[data-step-title]").textContent=steps[st.step];
 if(st.clockRunning&&!st.ended){
  timer=setInterval(()=>{st.clock=currentSeconds();renderSyncedClock();tickWildfires();triggerScheduledCues();persist()},1000);
  $("#startClock").textContent="Pause";renderSyncedClock();
 }
}
})();