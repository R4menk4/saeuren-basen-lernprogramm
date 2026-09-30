# Lernprogramme zu Säuren und Basen

Gemeinsame, statische Webanwendung mit einer Startseite für drei interaktive Lernprogramme:

1. **Oxonium-Ionen und pH-Wert**
2. **Säure-Base-Reaktionen üben**
3. **Brønsted-Basen erkennen**

## Öffnen

Die Datei `index.html` im Ordner `Lernprogramm` ist die gemeinsame Startseite. Von dort lassen sich beide Programme als Kacheln öffnen. Jedes Programm besitzt außerdem einen Link zurück zur Startseite.

## Ordnerstruktur

- `index.html` und `portal.css`: gemeinsame Startseite
- `oxonium-ph/`: Lernprogramm zu Oxonium-Ionen, pH-Wert und Indikatoren
- `reaktionstrainer/`: Übungsprogramm zu Reaktionsgleichungen, Donator/Akzeptor, Brønsted-Rollen und korrespondierenden Paaren
- `broensted-basen/`: Lernprogramm zu strukturellen Voraussetzungen von Brønsted-Basen
- `shared-nav.css`: gemeinsame Navigation zurück zur Startseite

Alle Inhalte sind direkt in HTML, CSS und JavaScript bearbeitbar. Es werden keine externen Bibliotheken benötigt. Der Lernfortschritt wird ausschließlich lokal im jeweiligen Browser gespeichert.

## Auf GitHub Pages veröffentlichen

Den vollständigen Ordner `Lernprogramm` in das Repository übernehmen. Wird er über GitHub Pages bereitgestellt, ist die gemeinsame Startseite unter `…/Lernprogramm/` erreichbar; alle internen Verknüpfungen funktionieren relativ zu dieser Adresse.
