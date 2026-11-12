# TAKTIKPLATTE · Feuerwehr-Planspiel

Aktueller Entwicklungsstand: **Version 5.1**. Die Anwendung ist eine Ausbildungs- und Übungssoftware, kein System zur realen Einsatzführung.

## Vorbereitung in vier Schritten

1. **Alarmierung**: Alarmstichwort, Einsatzadresse, Meldebild, Uhrzeit, Datum, Wetter, Temperatur, Windrichtung, Windstärke und Sicht; ausrückende Fahrzeuge mit Funkrufnamen und Personalstärken.
2. **Einsatzobjekt**: Suche nach verfügbarer Panoramax- oder optional Mapillary-Straßenaufnahme; Auswahl der Blickrichtung. Textliche Beschreibung realistischer Schadensmerkmale und Speicherung mehrerer Szenenstände. **KI-Bildbearbeitung ist noch nicht angeschlossen**; es wird daher noch kein bearbeitetes Bild generiert.
3. **Optionale Lageentwicklung**: Vorbereitete Ereignisse (erst nach Freigabe durch die Planspielleitung) oder klassisches statisches Planspiel durch Überspringen dieses Schritts.
4. **Planspiel**: Einsatzkarte für eine übende Führungskraft, getrennte lokale Teilnehmeransicht, manuelle taktische Zeichen (Fahrzeuge, Führung, Bereitstellung, Wasserentnahme, Einsatzarten, Personen), spontane Einspielungen, Übungsprotokoll und Druck-/PDF-Funktion.

## Fachliche Grundlage

Der Führungsvorgang nach dem Flyer **„Der Führungsvorgang“ der Hessischen Landesfeuerwehrschule** bleibt didaktische Grundlage: vier Phasen der Erkundung, acht Fragen der Beurteilung, Entschluss, Befehlsgebung und Kontrolle. Die Bearbeitung muss keine Führungskreislauf-Stufen im Programm auswählen. Die Zeichen orientieren sich an den **SKK-Empfehlungen für taktische Zeichen im Bevölkerungsschutz (2012)**; die aktuellen SVG-Symbole sind **vereinfachte eigene Darstellungen**, noch kein vollständiger Norm-Zeichenkatalog.

## Technische Hinweise

- Die Web-Anwendung läuft statisch auf GitHub Pages; der Kartendienst MapLibre lädt OSM und optional MapTiler.
- Die MapTiler- und optionale Mapillary-Client-Token-Eingabe wird lokal im Browser gespeichert. Keine vertraulichen Tokens oder Secrets in GitHub committen.
- Die automatische Foto-Suche hängt von Abdeckung, API-Verfügbarkeit und Nutzungsbedingungen der Straßenbildanbieter ab. Fundbilder sind fremde Bildinhalte. Bei späterer generativer Bearbeitung sind die Lizenz- und Nutzungsbedingungen zu prüfen.
- Die Teilnehmeransicht synchronisiert sich auf demselben Gerät über BroadcastChannel; **kein** echter Online-Mehrspieler-Dienst.
- Das Übungsprotokoll wird über die Browser-Druckfunktion als PDF gespeichert; ein separater Beobachtungsbogen als PDF ist eine geplante Folgestufe.
- **Kein autonomes Brandmodell, keine Spracherkennung, kein aktiver KI-Bildgenerator.**

## Code

Aktueller Einstiegspunkt: `index.html` lädt `app-v5.js`. Frühere Prototyp-Dateien sind historisch erhalten, werden jedoch nicht mehr geladen.
