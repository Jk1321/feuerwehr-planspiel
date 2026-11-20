# TAKTIKPLATTE · Feuerwehr-Planspiel

Aktueller Entwicklungsstand: **Version 7.6**. Die Anwendung ist eine Ausbildungs- und Übungssoftware, kein System zur realen Einsatzführung.

## Vorbereitung in vier Schritten

1. **Alarmierung**: Alarmstichwort, Einsatzadresse, Meldebild, Uhrzeit, Datum, Wetter, Temperatur, Windrichtung, Windstärke und Sicht; ausrückende Fahrzeuge mit Funkrufnamen und Personalstärken.
2. **Einsatzobjekt**: Suche nach verfügbarer Panoramax- oder optional Mapillary-Straßenaufnahme; Auswahl der Blickrichtung. Textliche Beschreibung realistischer Schadensmerkmale und Speicherung mehrerer Szenenstände. **KI-Bildbearbeitung ist noch nicht angeschlossen**; es wird daher noch kein bearbeitetes Bild generiert.
3. **Optionale Lageentwicklung**: Vorbereitete Ereignisse (erst nach Freigabe durch die Planspielleitung) oder klassisches statisches Planspiel durch Überspringen dieses Schritts.
4. **Planspiel**: Einsatzkarte für eine übende Führungskraft, getrennte lokale Teilnehmeransicht, manuelle taktische Zeichen (Fahrzeuge, Führung, Bereitstellung, Wasserentnahme, Einsatzarten, Personen), spontane Einspielungen, Übungsprotokoll und Druck-/PDF-Funktion.



## Mehrere Einsatzbilder für den Fahrzeugführer – Version 7.6

- **Schritt 2 / Zusätzliche Einsatzbilder:** Mehrere JPEG-, PNG- oder WebP-Dateien gemeinsam hochladen, z. B. Anfahrt, Eintreffen am Einsatzort, Frontal- und Rückansicht, Innenansicht. Bilder lassen sich nachträglich benennen und entfernen.
- **Freigabe durch die Übungsleitung:** Jede Zusatzansicht ist anfangs verborgen. In der Regiezentrale kann sie einzeln freigegeben/gesperrt und mit **„Anzeigen“** als aktuelle Teilnehmeransicht ausgewählt werden.
- **Teilnehmeransicht:** Der Fahrzeugführer sieht ausschließlich freigegebene Aufnahmen und kann über kompakte Vorschaubilder zwischen diesen und der freigegebenen Ausgangsansicht wechseln. Nicht freigegebene Zusatzbilder werden nicht über BroadcastChannel an die Teilnehmeransicht übertragen.
- **Lokale Datenspeicherung:** Die Dateien werden im Browser verkleinert, als JPEG gespeichert und im Szenario-JSON mitgeführt. Maximal zehn zusätzliche Bilder mit Größenbegrenzung durch den üblichen Browser-Speicher (ca. 4,4 MB Gesamtszenario, abhängig von Browser). **Vor einem Browserdaten-Löschen Szenario exportieren.**
- **Einschränkung:** Die aktuelle Live-Synchronisierung funktioniert ausschließlich in Tabs desselben Browsers bzw. derselben Browserumgebung, nicht zwischen fremden Geräten über das Internet. Bei sehr vielen Bildern kann der verfügbare Browser-Speicher begrenzen.

## Vegetationsbrand-Modul – Version 6.9

Grundlage ist das vom Nutzer bereitgestellte DITASI-Reel „Flächenbrände – Wohin läuft das Feuer?“ (Video-39954.mp4, 1:56 Min.).

- **Eigene Regie-Rubrik Flächenbrand:** Bewuchsarten Gras, Getreide, Heide und Wald; Brandausbruch auf der Lagekarte per Klick. Keine Schlauchleitungsplanung nötig.
- **Illustrative Flächenausbreitung:** Die Software erzeugt eine polygonale Brandfläche und zeichnet den vorderen Brandkopf mit einer hellen Linie, die übrige Begrenzung orange und die verbrannte Fläche dunkel. Ausbreitungsrichtung abhängig von Windrichtung; Bewuchs und Beaufort-Wert beeinflussen die schematische Geschwindigkeit. Eine echte Vegetationsbrand-Physik oder Rothermel-Modellierung ist ausdrücklich **nicht** implementiert.
- **Steuerung durch Planspielleitung:** Ausbreitung um eine oder fünf Übungsminuten vorantreiben, alternativ anhand der laufenden Übungsuhr je voller Minute weiterlaufen lassen. Windwerte können aus den aktuellen Übungsbedingungen neu übernommen werden. Ausbreitung anhalten/fortsetzen, Feuer als gelöscht markieren; dunkle Brandfläche bleibt sichtbar.
- **Lagedaten:** Näherungswerte für Fläche in ha, Kopf- und Rückenausdehnung, Flankenbreite sowie schematische Geschwindigkeit in Metern pro Übungsminute.
- **Nachbesprechung:** Jeder protokollierte Brandfortschritt wird zusammen mit Kartenelementen als Lagezustand gesichert und kann über die Regie-Zeitleiste wiedergegeben werden. Teilnehmeransicht erhält nur die Kartenvisualisierung und keine Regie-Bedienelemente.
- **Sicherheit:** Modellwerte sind rein didaktisch frei gewählte Parameter. Sie eignen sich weder zur Abschätzung eines echten Brandverlaufs noch zur Sicherheits- oder Löschangriffsplanung. Das Modul hat keine realen Brennstoff-, Wetter- und Geländedaten und unterscheidet sich damit fundamental von validierten Fachmodellen.

## Änderungen in Version 6.7

- **Abspielbare Nachbesprechung:** In der Planspielleitung lässt sich die Chronologie über eine Zeitleiste mit Slider, Vor/Zurück und Start/Pause durchgehen. Die gespeicherten Kartenzustände inklusive Fahrzeugpositionen, Orientierung und freigegebener Brand-/Rauchlage werden aufeinanderfolgend dargestellt. Wiedergabeschritte erfolgen momentan alle 1,2 Sekunden, nicht im realen Zeitmaßstab. Die Teilnehmeransicht bleibt während der Regie-Rückschau unverändert live. Auch die aktuelle Kartenposition der Regie wird durch das Aufrufen historischer Zustände nicht überschrieben.
- **Sichtbare Windbedingungen:** In der Lagekarte werden Windrichtung („aus“) und Beaufort-Wert eingeblendet. Die Pfeilrichtung kennzeichnet die Windbewegung **von** der angegebenen Himmelsrichtung **weg**.
- **Grafische Lageeffekte:** Brand- und Rauchzeichen können zusätzlich einen farbigen Ausbreitungsbereich in Windrichtung anzeigen. Dieser Bereich skaliert mit der bei einer Einspielung ausgewählten Intensität. Rein schematische Darstellung, **kein** physikalisches Feuer-, Rauch- oder Windmodell.
- **Kartengröße der Einsatzfahrzeuge:** Eine vereinfachte Längenskala differenziert Fahrzeuggruppen nach typischen Abmessungen. Sie ist nur eine Ausbildungsvisualisierung; für konkrete Fahrzeugtypen und Hubrettungsfahrzeuge sind Herstellerdaten und eine separate Modellprüfung erforderlich.
- **Nächster Entwicklungsschritt:** Detaillierte Fahrzeugmodule (insbesondere DLK/TM mit Abstützung und Reichweite), feinerer Verlauf von Bewegungsdaten sowie besseres Karten- und Layerhandling.

## Änderungen in Version 6.5

- **Teilnehmeransicht:** Das vollständige Werkzeugfeld „Taktische Zeichen“ ist für Teilnehmende ausgeblendet. Dort erscheinen nur freigegebene Lageinformationen und Kartenelemente.
- **Taktischer Zeichenkatalog in der Regie:** Drei Dropdowns für Organisation (Feuerwehr, Rettungsdienst, THW, Polizei), Fahrzeuggruppe bzw. Einsatzstellenzeichen und konkreten Typ. Fahrzeuge können während der Übung auch ohne vorherige Anlage bei der Alarmierung nachgefordert und auf die Karte gesetzt werden. Funkrufname und Stärke sind bei neuen Fahrzeugen optional.
- **Symbole:** Eigene vereinfachte taktische Zeichen mit organisationsabhängigen Farben, einschließlich Brand, Verkehrsunfall, Gefahrgut, Wasserentnahmestellen und RD-Fahrzeugen/Hubschraubern. Sie sind kein zertifizierter oder vollständiger SKK-Zeichenkatalog.
- **Funkverkehr:** Neue Regie-Rubrik zur Dokumentation von Lage auf Sicht, Eintreffmeldung, Lagemeldung, Nachforderung, Abschlussmeldung oder sonstigen Funkmeldungen. Übungszeit, Funkrufname und Inhalt werden während des laufenden Durchlaufs gespeichert und ins Protokoll aufgenommen.
- **Auswertung:** Anzeigen-/Ausblenden-Schaltvorgänge für Karte und Frontalansicht werden nicht mehr protokolliert. Bereits vorhandene solche Einträge werden in Chronologie und Ausdruck ausgefiltert.
- **Neuer Einsatz:** Mit „Neuen Einsatz erstellen“ bzw. „Neu“ werden Uhr, Protokoll, Funkmeldungen, Lage und Beenden-Status zurückgesetzt. Ein importiertes Szenario übernimmt hingegen dessen gespeicherten Zustand.

## Änderungen in Version 6.3

- **Einspielungen:** Die Angaben zur Brand- bzw. Rauchintensität erscheinen nur bei der entsprechenden Kategorie. Für alle anderen Kategorien sind diese Felder ausgeblendet. Beide Intensitäten werden über ein gemeinsames Auswahlfeld erfasst; eine Personen- oder Fahrzeugmeldung verändert die bereits bestehende Brand-/Rauchlage nicht.
- **Dokumentation:** Das Protokoll und die Lagehistorie beginnen ausschließlich mit dem ersten Klick auf **Start** der Übungsuhr. Vorbereitende Kartenbewegungen, Szenenbearbeitungen und Ereignisänderungen werden nicht als Übungsdurchlauf protokolliert. Beim ersten Start werden vorhandene ungestartete Protokolleinträge zurückgesetzt. Erst nach dem Start können Einspielungen freigegeben und Befehle dokumentiert werden.

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
