# TAKTIKPLATTE · Feuerwehr-Planspiel

Aktueller Entwicklungsstand: **Version 6.2**. Die Anwendung ist eine Ausbildungs- und Übungssoftware, kein System zur realen Einsatzführung.

## Vorbereitung in vier Schritten

1. **Alarmierung**: Alarmstichwort, Einsatzadresse, Meldebild, Uhrzeit, Datum, Wetter, Temperatur, Windrichtung, Windstärke und Sicht; ausrückende Fahrzeuge mit Funkrufnamen und Personalstärken.
2. **Einsatzobjekt**: Suche nach verfügbarer Panoramax- oder optional Mapillary-Straßenaufnahme; Auswahl der Blickrichtung. Textliche Beschreibung realistischer Schadensmerkmale und Speicherung mehrerer Szenenstände. **KI-Bildbearbeitung ist noch nicht angeschlossen**; es wird daher noch kein bearbeitetes Bild generiert.
3. **Optionale Lageentwicklung**: Vorbereitete Ereignisse (erst nach Freigabe durch die Planspielleitung) oder klassisches statisches Planspiel durch Überspringen dieses Schritts.
4. **Planspiel**: Einsatzkarte für eine übende Führungskraft, getrennte lokale Teilnehmeransicht, manuelle taktische Zeichen (Fahrzeuge, Führung, Bereitstellung, Wasserentnahme, Einsatzarten, Personen), spontane Einspielungen, Übungsprotokoll und Druck-/PDF-Funktion.



## Verbesserungen in Version 6.2

- **Einspielungen:** Jede manuelle Freigabe löst in der Teilnehmer- und Regieansicht einen roten, 3 Sekunden dauernden Blinkimpuls der Lagemeldung aus. Danach bleibt der Meldungstext normal lesbar.
- **Karte:** Die Fahrzeugtypen (u. a. LF, HLF, StLF/TLF, DLK, RW, ELW/MTF und Rettungsdienst) erhalten unterscheidbare, selbst gezeichnete Draufsichten. Brandstellen zeigen eine mehrschichtige SVG-Flamme; die Effekte sind grafisch und keine Brandsimulation.
- **Uhr:** Der Button „Beenden“ stoppt und sperrt die Übungszeit und weitere Einspielungen. Die Übungsleitung und die Teilnehmeransicht sehen den Abschluss. Das Übungsprotokoll bleibt erhalten.
- **Wetter:** Windstärke wird nun auf der Beaufort-Skala (0–12 Bft) eingegeben. Bereits vorhandene Windgeschwindigkeiten in km/h werden beim Laden alter Szenarien ungefähr in Bft überführt.

## Regiezentrale – Version 6.0

- **Drehbuch:** vorbereitete Einspielungen werden nach Übungsminute sortiert und **manuell** freigegeben. Zeiten lösen nichts automatisch aus.
- **Live-Einspielung:** neue Meldungen zu Feuer, Rauch, Personen und Maßnahmen; Befehle/Entscheidungen können für die Nachbesprechung dokumentiert werden.
- **Nachbesprechung:** Historie von Lagewechseln und dokumentierten Entscheidungen mit in der Regie wieder aufrufbaren Karten-Zuständen. Die Ansicht der Teilnehmenden wird durch eine Rückschau nicht verändert.
- **Teilnehmerfreigaben:** Karte und Frontalansicht lassen sich separat aus- und einblenden. Die unfreigegebene private Szenenbeschreibung wird nicht an die Teilnehmeroberfläche gerendert.
- **Kartensymbole:** konkrete Fahrzeugbezeichnungen aus der Alarmierung sowie skalierbare und um jeweils 15 Grad drehbare taktische Zeichen. Symbole können für Teilnehmende verborgen werden.
- **Hydranten:** auf Knopfdruck ein-/ausblendbare OpenStreetMap-Hydranten aus Overpass; Abdeckung und Dienste können lückenhaft sein. **Nicht für reale Löschwasserversorgungsplanung verwenden.**
- **Referenzen:** Die fünf bereitgestellten DITASI-Reels sowie das öffentlich beschriebene LüneFire FPS (OpenStreetMap-Karte, DV-102-artige Zeichen, verschieb-/drehbare Symbole, Hydrantenebene). Dies ist eine eigenständige Implementierung, keine Übernahme fremden Quellcodes.
- **Technik:** \`index.html\` lädt jetzt \`app-v6.js\` statt \`app-v5.js\`. Alte Dateien bleiben zur Nachvollziehbarkeit im Repository.

**Noch offen:** fotorealistische KI-Bildbearbeitung (Backend erforderlich), wirkliches Online-Multiplayer-/Remote-Viewing, vollständige SKK-Zeichenbibliothek, fotorealistische Brand-/Rauchanimationen und automatisierte feuerwehrtaktische Auswertung. Karteneffekte sind derzeit visualisierte Symbole, keine physikalische Brandsimulation.

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

Aktueller Einstiegspunkt: `index.html` lädt `app-v6.js`. Frühere Prototyp-Dateien sind historisch erhalten, werden jedoch nicht mehr geladen.
