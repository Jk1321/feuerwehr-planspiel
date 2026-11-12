/* Optional Google Places address suggestions for TAKTIKPLATTE.
   Google results populate the address form only; map coordinates are resolved separately. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const btn=$("googleAddressToggle"),settings=$("googleAddressSettings"),keyField=$("googlePlacesKey"),loadBtn=$("googlePlacesLoad"),status=$("googleAddressStatus"),mount=$("googleAutocompleteContainer"),address=$("address");
if(!btn||!settings||!keyField||!loadBtn||!status||!mount||!address)return;
let initialized=false,busy=false;
const saved=localStorage.getItem("taktikplatte-google-places-key")||"";
if(saved)keyField.value=saved;
btn.onclick=()=>{settings.hidden=!settings.hidden;btn.textContent=settings.hidden?"Einrichten":"Einstellungen schließen"};
function loadApi(key){
 return new Promise((resolve,reject)=>{
  if(window.google?.maps?.importLibrary){resolve();return}
  const callback="__taktikGoogleMapsReady";
  const previous=window[callback];
  let timer;
  window[callback]=()=>{clearTimeout(timer);if(previous)try{previous()}catch(e){}resolve()};
  const script=document.createElement("script");
  const url=new URL("https://maps.googleapis.com/maps/api/js");
  url.searchParams.set("key",key);url.searchParams.set("loading","async");url.searchParams.set("v","weekly");url.searchParams.set("libraries","places");url.searchParams.set("callback",callback);
  script.src=url.href;script.async=true;
  script.onerror=()=>{clearTimeout(timer);reject(new Error("Google Maps JavaScript API konnte nicht geladen werden."))};
  timer=setTimeout(()=>reject(new Error("Zeitüberschreitung beim Laden der Google-API.")),20000);
  document.head.append(script);
 })
}
async function initAutocomplete(){
 if(initialized)return;
 const key=keyField.value.trim();
 if(!key){status.textContent="Bitte zuerst deinen Google-API-Schlüssel eingeben.";return}
 if(busy)return;
 busy=true;loadBtn.disabled=true;status.textContent="Google Places wird geladen …";
 try{
  await loadApi(key);
  const {PlaceAutocompleteElement}=await google.maps.importLibrary("places");
  if(!PlaceAutocompleteElement)throw Error("Google Places (New) wurde nicht geladen. API-Aktivierung prüfen.");
  const autocomplete=new PlaceAutocompleteElement({includedRegionCodes:["de"]});
  autocomplete.id="taktikGooglePlaces";
  autocomplete.setAttribute("aria-label","Einsatzadresse mit Google Places suchen");
  mount.replaceChildren(autocomplete);
  mount.hidden=false;
  autocomplete.addEventListener("gmp-select",async(event)=>{
   try{
    const prediction=event.placePrediction;
    if(!prediction)return;
    const place=prediction.toPlace();
    await place.fetchFields({fields:["formattedAddress","addressComponents"]});
    const formatted=place.formattedAddress;
    if(!formatted)throw Error("Keine Adresse zu diesem Suchergebnis verfügbar.");
    address.value=formatted;
    address.dispatchEvent(new Event("change",{bubbles:true}));
    status.textContent="Google-Adresse übernommen. In Schritt 2 kannst du Straßenbilder dazu suchen.";
   }catch(err){status.textContent="Adresse konnte nicht übernommen werden: "+err.message}
  });
  autocomplete.addEventListener("gmp-error",()=>{status.textContent="Google Places meldet einen Fehler. API-Schlüssel, erlaubte Domain und Abrechnung prüfen."});
  localStorage.setItem("taktikplatte-google-places-key",key);
  initialized=true;
  settings.hidden=true;
  btn.textContent="Einstellungen öffnen";
  status.textContent="Google-Adressvorschläge aktiv. Suche die Adresse im zusätzlichen Feld.";
 }catch(err){status.textContent="Google-Adresssuche nicht verfügbar: "+err.message;console.error(err)}
 finally{busy=false;loadBtn.disabled=false}
}
loadBtn.onclick=initAutocomplete;
})();