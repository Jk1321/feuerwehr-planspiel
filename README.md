# TAKTIKPLATTE – Feuerwehr-Planspiel

Eigenständiger, kostenfreier Prototyp einer digitalen Planspielplatte für die Feuerwehrausbildung. Keine operative Einsatzführungssoftware.

## Start

`index.html` im Browser öffnen (Internetverbindung für MapLibre und Kartendaten erforderlich). Alternativ kostenlos über GitHub Pages bereitstellen.

## Funktionen

- Interaktive Karte mit MapLibre GL JS und freier OSM-Basiskarte
- Optional MapTiler Straßenkarte / Satellitenbilder mit eigenem, im Browser hinterlegtem API-Schlüssel
- Feuerwehrfahrzeuge und taktische Lagezeichen auf der Karte setzen, verschieben und bearbeiten
- Schlauchleitungen und Absperrungen zeichnen
- Übungsuhr, zeitgesteuerte Einspielungen, Teilnehmeransicht (gleicher Browser, BroadcastChannel)
- Lokaler Szenariospeicher und JSON-Import/Export

## Sicherheit & Grenzen

Der API-Schlüssel wird im Browser gespeichert und kann bei clientseitigen Kartenanwendungen ausgelesen werden. Deshalb im MapTiler-Dashboard die später verwendete Website als erlaubten HTTP-Origin freigeben. Keine Secrets im GitHub-Repository hinterlegen.

Für einen realen Einsatz nicht geeignet. Keine reale hydraulische, Brand- oder Rauchsimulation. Die parallele Teilnehmeransicht synchronisiert nur Browserfenster desselben Ursprungs; Online-Multiuser und Backend sind nicht Bestandteil der Version.

## GitHub Pages

1. Neues **öffentliches** Repository auf GitHub anlegen, z. B. `feuerwehr-planspiel`.
2. `index.html` und `README.md` in die oberste Ebene hochladen.
3. Einstellungen → Pages → Deploy from a branch → `main` / `(root)` → Save.
4. Nach der Bereitstellung die GitHub-Pages-Domain in MapTiler als erlaubten Origin eintragen.

OpenStreetMap-Karten: © OpenStreetMap-Mitwirkende. Bitte die Tile-Nutzungsregeln und Beschränkungen respektieren. Für größere Nutzung einen dedizierten Tile-Anbieter vorsehen.
