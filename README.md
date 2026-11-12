# TAKTIKPLATTE – Feuerwehr-Planspiel

Eigenständiger, kostenfreier Prototyp einer digitalen Planspielplatte für die Feuerwehrausbildung. Keine operative Einsatzführungssoftware.

## Start

`index.html` im Browser öffnen (Internetverbindung für MapLibre und Kartendaten erforderlich). Alternativ kostenlos über GitHub Pages bereitstellen.

## Funktionen

- Interaktive Karte mit MapLibre GL JS und freier OSM-Basiskarte
- Optional MapTiler Straßenkarte / Satellitenbilder mit eigenem API-Schlüssel
- Feuerwehrfahrzeuge und taktische Lagezeichen auf der Karte setzen
- Bessere, eigenständige Grafiken für Fahrzeuge, Feuer, Rauch, Hydranten und Verkehrsunfälle
- Frontalansicht / Erkundungsbild pro Szenario für die erste Lage beim Eintreffen
- Erkundungshinweise zur statischen Lage direkt im Szenario speichern
- B-/C-/A-Leitungen und Absperrungen als Linienobjekte
- Übungsuhr und zeitgesteuerte Einspielungen
- Teilnehmeransicht in separatem Browserfenster
- Lokales Speichern/Laden sowie JSON-Export/Import von Szenarien

## Typischer didaktischer Einsatz

Die Anwendung eignet sich besonders für Planspiele mit statischer Ausgangslage:

1. Eintreffen an der Einsatzstelle
2. Frontalansicht / erstes Lagebild betrachten
3. Erkundung nach den vier Phasen durchführen
4. Ersten Führungskreislauf durchlaufen
5. Ersten Befehl an Einheit oder Zug ableiten

## Hinweise

- Der MapTiler-API-Schlüssel wird lokal im Browser gespeichert.
- Für GitHub Pages oder andere Veröffentlichungen sollte der Schlüssel auf die jeweilige Domain beschränkt werden.
- Die Anwendung dient der Ausbildung und Übung, nicht der realen Einsatzführung.
