/* Automatische Straßenbildsuche für TAKTIKPLATTE über Panoramax STAC API.
   Bilder werden als Quellenbild angezeigt; Simulationselemente bleiben separate DOM-Overlays.
*/
(()=>{'use strict';
const $=id=>document.getElementById(id),map=window.taktikMap,viewer=new URLSearchParams(location.search).has('viewer');
if(!map||viewer)return;
const h3=[...document.querySelectorAll('.sidebar.left h3')].find(x=>x.textContent.includes('Frontalansicht'));
if(!h3)return;
const css=document.createElement('style');
css.textContent='.front-auto{border:1px solid #38546d;background:#111c2a;border-radius:10px;padding:10px;margin:9px 0 12px}.front-auto p{font-size:12px;color:#c1d1df;margin:6px 0}.front-auto .row{margin:7px 0}.front-auto button{font-size:12px}.front-auto small{font-size:11px;color:#a8c4d9}.front-auto .fstatus{padding:6px 0;min-height:28px}.front-auto .fcoords{font-variant-numeric:tabular-nums}.front-hidden{display:none!important}';
document.head.append(css);
const heading=h3;
const oldHelp=heading.nextElementSibling;if(oldHelp&&oldHelp.classList.contains('hint'))oldHelp.classList.add('front-hidden');
const url=$('front-url');if(url){let label=url.parentElement?.previousElementSibling;if(label&&label.tagName==='LABEL')label.classList.add('front-hidden');url.parentElement?.classList.add('front-hidden')}
const pick=$('pick-front');if(pick)pick.parentElement?.classList.add('front-hidden');
const notes=$('front-notes');if(notes){let label=notes.previousElementSibling;if(label&&label.tagName==='LABEL')label.textContent='Erkundungshinweise (optional)'}
const box=document.createElement('div');box.className='front-auto';
box.innerHTML='<p><strong>Straßenbild automatisch aus der Einsatzadresse</strong></p><div class="fstatus" id="fstatus" aria-live="polite">Suche einen Ort oder wähle das Gebäude auf der Karte.</div><div class="row"><button id="fsearch">Bild am Kartenmittelpunkt suchen</button><button id="fpick">Objekt auf Karte wählen</button></div><div class="row" id="fnav" style="display:none"><button id="fprev">Vorheriges Foto</button><button id="fnext">Nächstes Foto</button></div><small id="fcredit">Bildquelle: Panoramax · Bilder stehen möglicherweise nicht für jede Adresse zur Verfügung.</small>';
heading.after(box);
const status=$('fstatus'),nav=$('fnav'),credit=$('fcredit');
const api='https://api.panoramax.xyz/api';
let results=[],current=0,searchId=0,pickMode=false,target=null;
const rad=Math.PI/180;
function distance(a,b){let dlat=(b.lat-a.lat)*rad,dlon=(b.lon-a.lon)*rad;let h=Math.sin(dlat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
function assetURL(f){const a=f.assets||{};const value=(key)=>a[key]?.href;return value('sd')||value('visual')||value('thumbnail')||value('thumb')||Object.values(a).find(v=>Array.isArray(v.roles)&&v.roles.some(z=>z==='visual'||z==='thumbnail'))?.href||f.properties?.['geovisio:thumbnail']||(f.id?api+'/pictures/'+encodeURIComponent(f.id)+'/sd.jpg':null)}
function featurePoint(f){const c=f.geometry?.coordinates;if(Array.isArray(c)&&c.length>=2)return {lat:Number(c[1]),lon:Number(c[0])};return null}
function setImg(index){if(!results.length)return;current=(index+results.length)%results.length;const x=results[current];try{window.taktikSetFrontImage?.(x.url,'Panoramax – '+x.id)}catch(e){console.warn(e)}
const m=Math.round(x.m);status.innerHTML='Foto '+(current+1)+'/'+results.length+' · ungefähr '+m+' m vom markierten Ort entfernt.';
credit.textContent='Quelle: Panoramax · Foto '+x.id+' · Straßenaufnahme, Objekt/Blickrichtung bitte prüfen.';
nav.style.display=results.length>1?'flex':'none';
document.getElementById('v4photo')?.setAttribute('src',x.url);
}
async function fetchRadius(lat,lon,d=0.0005){const url=new URL(api+'/search');url.searchParams.set('bbox',[lon-d,lat-d,lon+d,lat+d].join(','));url.searchParams.set('limit','45');const response=await fetch(url,{headers:{Accept:'application/geo+json,application/json'}});if(!response.ok)throw new Error('Panoramax HTTP '+response.status);const data=await response.json();return data.features||[]}
async function findAround(lat,lon){const requestId=++searchId;const p={lat,lon};target=p;status.textContent='Suche verfügbare Straßenaufnahmen im Umfeld …';nav.style.display='none';
try{let features=[];for(const r of [0.00035,0.0012,0.003]){features=await fetchRadius(lat,lon,r);if(requestId!==searchId)return;if(features.length)break}
let options=features.map(f=>{const coords=featurePoint(f),url=assetURL(f);return coords&&url?{id:f.id,url:new URL(url,api+'/').href,m:distance(p,coords)}:null}).filter(Boolean).sort((a,b)=>a.m-b.m);const seen=new Set();options=options.filter(x=>{if(seen.has(x.id))return false;seen.add(x.id);return true}).slice(0,12);
if(!options.length){results=[];status.textContent='In diesem Bereich sind keine Panoramax-Straßenbilder verfügbar. Eine passende Frontalansicht kann hier nicht automatisch angezeigt werden.';credit.textContent='Die Lagekarte bleibt nutzbar. Wir können später weitere Bildquellen ergänzen.';return}
results=options;current=0;setImg(0)
}catch(e){if(requestId!==searchId)return;status.textContent='Straßenbildsuche derzeit nicht möglich: '+e.message;console.warn(e)}
}
function mapPos(){const p=map.getCenter();return {lat:p.lat,lon:p.lng}}
$('fsearch').onclick=()=>{const p=mapPos();findAround(p.lat,p.lon)};
$('fpick').onclick=()=>{if(pickMode)return;pickMode=true;$('cancel')?.click();status.textContent='Jetzt das Einsatzobjekt auf der Karte anklicken.';map.once('click',e=>{pickMode=false;findAround(e.lngLat.lat,e.lngLat.lng)})};
$('fprev').onclick=()=>setImg(current-1);$('fnext').onclick=()=>setImg(current+1);
const find=$('find');if(find)find.addEventListener('click',()=>{map.once('moveend',()=>{const p=mapPos();findAround(p.lat,p.lon)})});
window.taktikFrontSearch=(lat,lon)=>findAround(lat,lon);
})();