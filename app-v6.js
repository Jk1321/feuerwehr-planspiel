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
const initial=()=>({step:0,title:"",stichwort:"F 2",meldebild:"",address:"",date:new Date().toISOString().slice(0,10),time:"12:00",weather:"",temp:"",windDir:"",windSpeed:"",windUnit:"bft",visibility:"",vehicles:[{id:uid(),type:"LF 10",radio:"",crew:"0/1/8/9"}],imageUrl:"",imageSource:"",imageCredit:"",imageLat:null,imageLon:null,scene:"",versions:[],dynamic:true,cues:[],objects:[],journal:[],radioMessages:[],clock:0,started:false,ended:false,endedAt:null,cueSignal:null,mapCenter:[8.626,50.513],mapZoom:15,mapStyle:"osm",releaseFront:true,releaseMap:true,history:[],hydrantsVisible:false,hydrants:[]});
let st=initial();try{const x=JSON.parse(localStorage.getItem("taktikplatte-wizard-v5")||"null");if(x){st={...initial(),...x};if(!x.windUnit&&x.windSpeed!==""&&x.windSpeed!=null){const kmh=Number(x.windSpeed);st.windSpeed=String([1,6,12,20,29,39,50,62,75,89,103,118].filter(v=>kmh>=v).length);st.windUnit="bft"}}}catch{}
let lastSeenCue=st.cueSignal?.id||null,flashTimer=null;let map=null,markers=[],hydrantMarkers=[],tool="",photos=[],photoIndex=0,activePanel="",startTime=0,timer=null,bc=null,geoloc=null;
try{bc=new BroadcastChannel("taktikplatte-wizard-v5")}catch{}
const bftLabel=v=>v===""||v==null?"–":String(v)+" Bft";
function migrateScenarioWind(x){if(!x.windUnit&&x.windSpeed!==""&&x.windSpeed!=null){const kmh=Number(x.windSpeed);if(Number.isFinite(kmh)){x.windSpeed=String([1,6,12,20,29,39,50,62,75,89,103,118].filter(v=>kmh>=v).length)}}x.windUnit="bft";return x}
const stamp=()=>String(Math.floor(st.clock/3600)).padStart(2,"0")+":"+String(Math.floor(st.clock%3600/60)).padStart(2,"0")+":"+String(st.clock%60).padStart(2,"0");
function log(type,detail){if(type==="Teilnehmerfreigabe")return;if(isViewer||!st.started||(st.ended&&type!=="Übungsende"))return;st.journal.push({time:stamp(),type,detail});if(st.journal.length>300)st.journal.shift();if(!Array.isArray(st.history))st.history=[];st.history.push({id:uid(),time:stamp(),type,detail,objects:structuredClone(st.objects),cue:st.activeCue?{...st.activeCue}:null,center:[...st.mapCenter],zoom:st.mapZoom});if(st.history.length>90)st.history.shift();renderHistory()}
function persist(){try{localStorage.setItem("taktikplatte-wizard-v5",JSON.stringify(st))}catch(e){console.warn(e)}if(!isViewer)bc?.postMessage({kind:"sync",state:st})}
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
function storeForm(){if(isViewer)return;for(const key of ["title","stichwort","meldebild","address","date","time","weather","temp","windDir","windSpeed","visibility","scene"]){const el=$('[name="'+key+'"]');if(el)st[key]=el.value}st.dynamic=$("#dynamicEnabled")?.checked??st.dynamic;persist()}
function form(){for(const key of ["title","stichwort","meldebild","address","date","time","weather","temp","windDir","windSpeed","visibility","scene"]){const el=$('[name="'+key+'"]');if(el)el.value=st[key]??""}$("#dynamicEnabled").checked=st.dynamic;renderVehicles();renderPhoto();renderCues();renderVersions();updateSummary()}
function go(step,skipFormSave=false){if(step<0||step>3)return;document.body.classList.remove("landing-mode");if(!skipFormSave)storeForm();st.step=step;$$(".step-content").forEach((e,i)=>e.classList.toggle("active",i===step));stepText();form();if(step===3){setupMap();renderTools();requestAnimationFrame(()=>{map?.resize();setTimeout(()=>map?.resize(),180)})}window.scrollTo({top:0,behavior:"smooth"});persist()}
function renderVehicles(){$("#vehicles").innerHTML=st.vehicles.map((v,i)=>'<div class="vehicle-line"><div class="field"><label>Fahrzeug</label><input data-v="'+v.id+'" data-field="type" value="'+safe(v.type)+'" placeholder="LF 10"></div><div class="field"><label>Funkrufname</label><input data-v="'+v.id+'" data-field="radio" value="'+safe(v.radio)+'" placeholder="2-42-1"></div><div class="field"><label>Stärke</label><input data-v="'+v.id+'" data-field="crew" value="'+safe(v.crew)+'" placeholder="0/1/8/9"></div><button class="icon-btn" title="Fahrzeug entfernen" data-del-v="'+v.id+'">×</button></div>').join("");$$("[data-v]").forEach(x=>x.onchange=()=>{const v=st.vehicles.find(v=>v.id===x.dataset.v);if(v)v[x.dataset.field]=x.value;persist()});$$("[data-del-v]").forEach(x=>x.onclick=()=>{st.vehicles=st.vehicles.filter(v=>v.id!==x.dataset.delV);renderVehicles();persist()})}
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
$("#cueType").onchange=()=>toggleIntensity("#cueType","#cueIntensityField","#cueIntensityLabel");
$("#liveType").onchange=()=>toggleIntensity("#liveType","#liveIntensityField","#liveIntensityLabel");
toggleIntensity("#cueType","#cueIntensityField","#cueIntensityLabel");
toggleIntensity("#liveType","#liveIntensityField","#liveIntensityLabel");
$("#addCue").onclick=()=>{
 storeForm();
 const type=$("#cueType").value,affected=type==="fire"||type==="smoke";
 st.cues.push({id:uid(),minute:Number($("#cueMinute").value)||0,type,description:$("#cueText").value.trim()||"Neue Lagemeldung",state:"ready",...(affected?{intensity:Number($("#cueIntensity").value)}:{})});
 $("#cueText").value="";renderCues();persist();
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
 const current=st.activeCue||{},next={type,description:original.description,fire:current.fire??0,smoke:current.smoke??0};
 if(type==="fire")next.fire=intensity===undefined?Number(original.fire??0):Number(intensity);
 if(type==="smoke")next.smoke=intensity===undefined?Number(original.smoke??0):Number(intensity);
 return next;
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
 st.activeCue=affectedCue(type,degree,{description:text});
 st.cueSignal={id:uid(),at:Date.now()};log("Spontane Lageänderung",text);
 $("#liveText").value="";renderParticipantScene();signalCueFlash();renderMarkers();persist();toast("Spontane Lageänderung freigegeben");
};
function renderPhoto(){const img=$("#frontPhoto"),empty=$("#frontEmpty");if(st.imageUrl){img.src=st.imageUrl;img.hidden=false;empty.hidden=true;img.onerror=()=>{img.hidden=true;empty.hidden=false;empty.textContent="Bild konnte nicht geladen werden. Eine andere Aufnahme wählen.";};}else{img.hidden=true;empty.hidden=false;empty.textContent="Wähle eine Adresse und suche eine verfügbare Straßenaufnahme."}
$("#photoCredit").textContent=st.imageCredit||"Noch keine Bildquelle ausgewählt";$("#photoAddressHint").textContent=st.address||"In Schritt 1 eine Einsatzadresse angeben.";$("#photoCount").textContent=photos.length?photoIndex+1+" / "+photos.length:"";renderParticipantScene()}
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

async function compressUploadedImage(file){
  if(!file.type.startsWith("image/"))throw new Error("Bitte eine Bilddatei auswählen.");
  const objectURL=URL.createObjectURL(file);
  try{
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error("Bildformat kann vom Browser nicht geöffnet werden."));i.src=objectURL});
    const maxDim=1400,scale=Math.min(1,maxDim/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
    canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext("2d");
    if(!ctx)throw new Error("Bild konnte nicht verarbeitet werden.");
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    let quality=.77,output=canvas.toDataURL("image/jpeg",quality);
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
 const rows=[["Alarmstichwort",st.stichwort||"–"],["Einsatzort",st.address||"Noch nicht angegeben"],["Wetter / Wind",(st.weather||"–")+" · "+(st.windDir||"–")+" · "+bftLabel(st.windSpeed)],["Ersteintreffende Fahrzeuge",st.vehicles.length+" Fahrzeug(e)"]];
 if(!isViewer)rows.push(["Lageentwicklung",st.dynamic?"Manuell steuerbar":"Klassisches Planspiel"]);
 $("#summary").innerHTML=rows.map(([key,val])=>'<div><span>'+safe(key)+'</span><b>'+safe(val)+'</b></div>').join("");
}
function renderParticipantScene(){const p=$("#participantPhoto"),w=$("#participantPhotoEmpty");if(st.imageUrl&&(!isViewer||st.releaseFront!==false)){p.src=st.imageUrl;p.hidden=false;w.hidden=true;p.onerror=()=>{p.hidden=true;w.hidden=false}}else{p.hidden=true;w.hidden=false;w.textContent=isViewer&&st.releaseFront===false?"Frontalansicht noch nicht freigegeben":"Noch keine Straßenaufnahme ausgewählt."}
const c=st.activeCue;$("#participantCue").textContent=c?c.description:(st.meldebild||"Ausgangslage – Erkundung beginnen.");$("#participantSceneTitle").textContent=st.ended?"Einsatz beendet":c?"Neue Lagemeldung":"Erstes Lagebild";
$("#participantSceneNote").textContent=st.imageCredit||"Frontalansicht des Einsatzobjekts";
if(isViewer)refreshReleaseViews();renderEnded();
}
function renderEnded(){
 const isDone=Boolean(st.ended),panel=$("#exerciseEnded");
 if(panel){panel.hidden=!isDone;$("#exerciseEndTime").textContent=isDone?"Endzeit "+(st.endedAt||stamp()):""}const participantEnd=$("#participantEnded");if(participantEnd){participantEnd.hidden=!isDone;$("#participantEndTime").textContent=isDone?"Endzeit "+(st.endedAt||stamp()):""}
 document.body.classList.toggle("exercise-finished",isDone);
 if(isDone){$("#startClock").textContent="Beendet";$("#timeCounter").textContent=st.endedAt||stamp();$("#participantSceneTitle").textContent="Einsatz beendet";}
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
function setupMap(){if(map){map.resize();renderMarkers();return}if(!window.maplibregl){toast("Kartenbibliothek konnte nicht geladen werden",true);return}
map=new maplibregl.Map({container:"map",style:osm,center:st.mapCenter,zoom:st.mapZoom,attributionControl:true});map.on("error",e=>{const msg=String(e.error?.message||"");if(/401|403|forbidden|unauthorized/i.test(msg)&&st.mapStyle!=="osm"){st.mapStyle="osm";$("#mapStyle").value="osm";map.setStyle(osm);toast("MapTiler-Karte konnte nicht geladen werden. OpenStreetMap wurde aktiviert.",true)}});map.addControl(new maplibregl.NavigationControl(),"top-right");map.on("load",()=>{map.resize();renderMarkers();renderHydrants()});map.on("style.load",()=>{renderMarkers();renderHydrants()});map.on("moveend",()=>{if(isViewer)return;st.mapCenter=[map.getCenter().lng,map.getCenter().lat];st.mapZoom=map.getZoom();persist()});map.on("zoomend",()=>renderMarkers());
map.on("click",e=>{if(isViewer||st.ended||!tool||reviewSnapshot)return;const selected=tool.startsWith("vehicle:")?st.vehicles.find(x=>x.id===tool.slice(8)):null;const catalog=tool==="catalog"?catalogSelection():null;const type=selected||catalog?.kind==="fahrzeug"?"fahrzeug":catalog?.kind||tool;const org=selected?.org||catalog?.org||"fw";const vehicleType=selected?.type||catalog?.type||"";const radio=selected?.radio||((catalog?.kind==="fahrzeug")?$("#tacticCallsign").value.trim():"");const crew=selected?.crew||((catalog?.kind==="fahrzeug")?$("#tacticCrew").value.trim():"");const label=selected||catalog?(vehicleType+(radio?" · "+radio:"")):"";st.objects.push({id:uid(),type,lat:e.lngLat.lat,lon:e.lngLat.lng,org,vehicleType,radio,crew,size:1,rotation:0,label:label||catalog?.type||""});tool="";renderTools();renderMarkers();log("Lagekarte",type+" platziert");persist()});
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
function renderMarkers(override){
 if(!map)return;markers.forEach(m=>m.remove());markers=[];
 const objects=override||reviewSnapshot?.objects||st.objects;
 for(const obj of objects){
  if(isViewer&&obj.hiddenToViewer)continue;
  const el=document.createElement("button");el.className="map-pin";if(obj.type==="fahrzeug")el.classList.add("vehicle-marker");if(obj.type==="brand")el.classList.add("brand-marker");el.type="button";
  const px=obj.type==="fahrzeug"?Math.max(34,Math.min(85,Math.round(9/(156543.03392*Math.cos(obj.lat*Math.PI/180)/Math.pow(2,map.getZoom()))))):obj.type==="brand"?46:30;
  const symbol=obj.type==="fahrzeug"?tacticalVehicleSvg(obj.vehicleType||obj.label||"FW",obj.org||"fw",true):tacticalSceneSvg(obj.type,obj.label||obj.type,true);
  el.innerHTML='<span class="pin-graphic" style="display:inline-flex;transform:rotate('+Number(obj.rotation||0)+'deg)">'+symbol+'</span>'+(obj.label?'<span>'+safe(obj.label)+'</span>':"");
  el.querySelector("svg")?.setAttribute("width",String(Math.max(26,Math.round(px*(obj.size||1)))));
  el.querySelector("svg")?.setAttribute("height",String(Math.max(26,Math.round(px*(obj.size||1)*(obj.type==="fahrzeug"?.85:1)))));
  const effectCue=reviewSnapshot?.cue||st.activeCue;const intensity=obj.type==="brand"?Number(effectCue?.fire||0):obj.type==="rauch"?Number(effectCue?.smoke||0):0;
  if(intensity>0){el.classList.add(obj.type==="brand"?"fire-active":"smoke-active");const v=el.querySelector("svg");if(v){v.setAttribute("width",String(Math.min(95,Number(v.getAttribute("width"))*(1+intensity*.23))));v.setAttribute("height",String(Math.min(95,Number(v.getAttribute("height"))*(1+intensity*.23))))}}
  el.title=(obj.label||obj.type)+" · "+(isViewer?"Einsatzdarstellung":"bearbeiten, drehen oder entfernen");
  const marker=new maplibregl.Marker({element:el,draggable:!isViewer&&!reviewSnapshot,anchor:"center"}).setLngLat([obj.lon,obj.lat]).addTo(map);
  if(!isViewer&&!reviewSnapshot&&!st.ended){
   const popup=document.createElement("div");popup.className="marker-edit";
   popup.innerHTML='<strong>'+safe(obj.label||obj.type)+'</strong><div><button type="button" data-rot="-15">↶ 15°</button><button type="button" data-rot="15">↷ 15°</button><button type="button" data-size="-0.2">− Größe</button><button type="button" data-size="0.2">+ Größe</button></div><label style="display:block;font-size:11px"><input type="checkbox" data-hide '+(obj.hiddenToViewer?"checked":"")+'> Für Teilnehmer verbergen</label><button type="button" data-delete class="danger">Entfernen</button>';
   el.onclick=e=>{e.stopPropagation();const p=new maplibregl.Popup({offset:18,closeOnClick:true,maxWidth:"250px"}).setLngLat([obj.lon,obj.lat]).setDOMContent(popup).addTo(map);
    popup.querySelectorAll("[data-rot]").forEach(b=>b.onclick=()=>{obj.rotation=((Number(obj.rotation)||0)+Number(b.dataset.rot)+360)%360;log("Symbol gedreht",obj.label||obj.type);p.remove();renderMarkers();persist()});
    popup.querySelectorAll("[data-size]").forEach(b=>b.onclick=()=>{obj.size=Math.max(.6,Math.min(3,Number((Number(obj.size||1)+Number(b.dataset.size)).toFixed(2))));log("Symbolgröße",obj.label||obj.type);p.remove();renderMarkers();persist()});
    popup.querySelector("[data-hide]").onchange=e=>{obj.hiddenToViewer=e.target.checked;log("Sichtbarkeit",obj.label||obj.type);persist()};
    popup.querySelector("[data-delete]").onclick=()=>{st.objects=st.objects.filter(x=>x.id!==obj.id);log("Symbol entfernt",obj.label||obj.type);p.remove();renderMarkers();persist()}
   };
   marker.on("dragend",()=>{const p=marker.getLngLat();obj.lon=p.lng;obj.lat=p.lat;log("Fahrzeug/Symbol verschoben",obj.label||obj.type);persist()});
  }
  markers.push(marker)
 }
}
function renderHistory(){
 const host=$("#historyItems");if(!host||isViewer)return;
 const items=st.started&&Array.isArray(st.history)?st.history.filter(x=>x.type!=="Teilnehmerfreigabe"):[];
 host.innerHTML=items.length?[...items].reverse().map(x=>'<div class="history-line"><time>'+safe(x.time)+'</time><strong>'+safe(x.type)+'</strong><div>'+safe(x.detail)+'</div><button data-review="'+safe(x.id)+'">Lagezustand anzeigen</button></div>').join(""):'<p class="helper">'+(st.started?'Noch keine dokumentierten Lageänderungen.':'Die Dokumentation beginnt mit dem Start des Übungsdurchlaufs.')+'</p>';
 host.querySelectorAll("[data-review]").forEach(btn=>btn.onclick=()=>{reviewSnapshot=items.find(x=>x.id===btn.dataset.review);if(reviewSnapshot){renderMarkers();$("#returnLive").hidden=false;toast("Historischer Lagezustand angezeigt – Teilnehmeransicht unverändert.")}});
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
 if(timer){clearInterval(timer);timer=null}
 st=initial();photos=[];photoIndex=0;tool="";reviewSnapshot=null;
 $("#timeCounter").textContent="00:00:00";$("#startClock").textContent="Start";
 $("#exerciseEnded").hidden=true;$("#participantEnded").hidden=true;
 $("#radioText").value="";
 renderEnded();renderRadioMessages();
 document.body.classList.remove("exercise-finished");
}
$("#newBtn").onclick=()=>{if(confirm("Neues Szenario beginnen? Gespeicherte Daten können überschrieben werden.")){newExercise();go(0,true);renderTools()}};
$("#startClock").onclick=()=>{
 if(st.ended)return;
 if(timer){clearInterval(timer);timer=null;$("#startClock").textContent="Fortsetzen";persist();return}
 if(!st.started){
  st.started=true;st.clock=0;st.journal=[];st.history=[];st.radioMessages=[];renderRadioMessages();
  $("#timeCounter").textContent=stamp();
  log("Übungsstart","Übungsdurchlauf durch die Planspielleitung gestartet");
 }
 let last=Date.now();
 timer=setInterval(()=>{const now=Date.now();st.clock+=Math.max(0,Math.round((now-last)/1000));last=now;$("#timeCounter").textContent=stamp();persist()},1000);
 $("#startClock").textContent="Pause";persist()
};
$("#resetClock").onclick=()=>{if(st.ended)return;st.clock=0;$("#timeCounter").textContent=stamp();persist()};

$("#endExercise").onclick=()=>{
 if(st.ended)return;
 if(!confirm("Planspiel jetzt beenden? Die Uhr und weitere Einspielungen werden gesperrt."))return;
 if(timer){clearInterval(timer);timer=null}
 st.ended=true;st.endedAt=stamp();st.cueSignal=null;
 log("Übungsende","Planspiel durch Übungsleitung beendet");
 renderEnded();renderParticipantScene();persist();toast("Einsatz beendet. Die Lage wurde abgeschlossen.")
};
$("#printBtn").onclick=()=>{if(!st.started)return toast("Die Übungsdokumentation beginnt erst mit „Start“.",true);const sec=document.createElement("section");sec.id="printContent";sec.innerHTML="<h1>TAKTIKPLATTE – Übungsprotokoll</h1><p>"+safe(st.stichwort)+" · "+safe(st.address)+"</p><p>"+safe(st.date)+" · "+safe(st.time)+" · "+safe(st.weather)+" · Wind "+safe(st.windDir)+" "+safe(bftLabel(st.windSpeed))+"</p><h2>Einsatzmittel</h2><p>"+st.vehicles.map(x=>safe(x.type)+" "+safe(x.radio)+" ("+safe(x.crew)+")").join("; ")+"</p><h2>Chronologie</h2><table>"+st.journal.filter(x=>x.type!=="Teilnehmerfreigabe").map(x=>"<tr><td>"+safe(x.time)+"</td><td>"+safe(x.type)+"</td><td>"+safe(x.detail)+"</td></tr>").join("")+"</table>";document.body.append(sec);window.print();setTimeout(()=>sec.remove(),1000)};
function viewerStart(){document.body.classList.remove("landing-mode");document.body.classList.add("viewer");st.step=3;$$(".step-content").forEach((e,i)=>e.classList.toggle("active",i===3));$("#controls").hidden=true;$("#viewerBanner").hidden=false;$("#toolkit").hidden=true;$("#vehicleTools").hidden=true;$("#directorPanel").hidden=true;$("#mapActions").hidden=true;$("#openViewer").hidden=true;$("#printBtn").hidden=true;$("#saveBtn").hidden=true;$("#exportBtn").hidden=true;$("#newBtn").hidden=true;$("#importBtn").hidden=true;renderParticipantScene();updateSummary();stepText();setupMap();renderEnded();refreshReleaseViews();bc?.postMessage({kind:"request"})}
if(bc)bc.onmessage=e=>{if(isViewer&&e.data?.kind==="sync"){st={...initial(),...e.data.state,step:3};updateSummary();renderParticipantScene();signalCueFlash();refreshReleaseViews();if(map){renderMarkers();renderHydrants();if(st.mapCenter)map.jumpTo({center:st.mapCenter,zoom:st.mapZoom})}}else if(!isViewer&&e.data?.kind==="request")persist()};
window.addEventListener("beforeunload",persist);

function showDirectorTab(id){$$("[data-director-tab]").forEach(b=>b.classList.toggle("selected",b.dataset.directorTab===id));$$("[data-director-panel]").forEach(p=>p.classList.toggle("selected",p.dataset.directorPanel===id));if(id==="review")renderHistory();if(id==="radio")renderRadioMessages()}
$$("[data-director-tab]").forEach(b=>b.onclick=()=>showDirectorTab(b.dataset.directorTab));
$("#directorAddCue").onclick=()=>go(2);
$("#logCommand").onclick=()=>{if(!st.started||st.ended)return toast("Dokumentation ist nur während des gestarteten Übungsdurchlaufs möglich.",true);const n=$("#commandNote").value.trim();if(!n)return toast("Bitte eine Notiz eingeben",true);log("Befehl / Entscheidung",n);$("#commandNote").value="";persist();toast("In der Chronologie dokumentiert")};
$("#returnLive").onclick=()=>{reviewSnapshot=null;renderMarkers();$("#returnLive").hidden=true;toast("Aktueller Lagezustand wiederhergestellt")};
$("#exportProtocol").onclick=()=>$("#printBtn").click();
$("#showViewerFront").checked=st.releaseFront!==false;
$("#showViewerMap").checked=st.releaseMap!==false;
$("#showViewerFront").onchange=e=>{st.releaseFront=e.target.checked;persist()};
$("#showViewerMap").onchange=e=>{st.releaseMap=e.target.checked;persist()};

renderTools();form();renderRadioMessages();$("#timeCounter").textContent=stamp();renderEnded();
function importScenario(file){if(!file)return;file.text().then(t=>{const j=JSON.parse(t);if(!Array.isArray(j.objects)||!Array.isArray(j.vehicles))throw Error("Ungültige Szenario-Datei");st={...initial(),...migrateScenarioWind(j),step:0};document.body.classList.remove("landing-mode");go(0,true);renderTools();toast("Einsatz erfolgreich geladen")}).catch(e=>toast("Import fehlgeschlagen: "+e.message,true))}
$("#landingNew").onclick=()=>{newExercise();document.body.classList.remove("landing-mode");go(0,true);renderTools()};
$("#landingImport").onclick=()=>$("#landingFile").click();
$("#landingFile").onchange=e=>importScenario(e.target.files?.[0]);
$("#homeBtn").onclick=()=>{storeForm();persist();document.body.classList.add("landing-mode");window.scrollTo(0,0)};
if(isViewer)viewerStart();else{document.body.classList.add("landing-mode");$("[data-step-title]").textContent=steps[st.step]}
})();