# Das Browsergames "Cryptic"

Hier wird das Spiel entwickelt. Wer bei der Entwicklung dieser Website mitwirken will sollte sich per Discord bei USE-TO (*Head of Development*, Discord: USE-TO#3627)
oder FelixRewer (*Head of Frontend Development*, Discord: Felix#9050) melden und
unbedingt das [Lastenheft](https://git.the-morpheus.de/architektur/architektur/tree/master/Lastenheft) und
das [Gamedesign](https://git.the-morpheus.de/architektur/architektur/tree/master/Gamedesign) lesen.

**!** Das hier ist nicht die Website. Sie ist [hier](https://git.the-morpheus.de/development/website) zu finden.

# Hinweise für Entwickler

Diese Webanwendung ist mit dem Framework **Angular** erstellt worden. Das Framework stellt eine Mischung
aus *TypeScript* (Eine Abwandlung von Javascript), *HTML* und *SCSS*. Ein grundlegenes Verständnis
dieser Sprachen wird für das Verstehen des Codes vorausgesetzt.
*SCSS* bzw. [*Sass*](http://sass-lang.com/guide) (das gleiche mit anderer Syntax) ist ein CSS-Preprozessor.
Ein Tutorial dazu findet ihr [hier](https://www.toptal.com/sass/theming-scss-tutorial).
Ein [Tutorial](https://bit.ly/2tJuWdu) zu **Angular** von Morpheus ist **nur** für Entwickler zu gänglich!
Das Framework nutzt außerdem noch eine **CLI** (*Comand Line Interface*).
Diese ist dabei behilflich Angular Projekte schnell und einfach zu erstellen, zu bearbeiten und zu verwalten.

## Editor

Das Projekt funktioniert natürlich mit jedem Editor und hat auch in jedem eine spezielle Konfiguration.
Wir empfehlen hier aber den Editor [VSCode](https://code.visualstudio.com) von Microsoft. Visual Studio Code
hat unter anderem einen eingebauten Debugger und einen hilfreichen *git* Support.

## Einrichten und Starten der Testumgebung

Zum Kompilieren und Starten der Anwendung werden zwangsläufig **NodeJS** und **NPM** benötigt.
Downloads und Installationsanweisungen dieser Programme können unter [https://nodejs.org/de/](https://nodejs.org/de/) 
gefunden werden.

Nach Installation der Programme wird der Code benötigt. Es wird dringend empfohlen diesen mit
`git clone` herunterzuladen, das Herunterladen und Entpacken eines ZIP-Archivs ist jedoch auch möglich.
Einzelheiten hierzu sind der Dokumentation von *git* bzw. *GitLab* zu entnehmen.

### Mit VSCode

Nach Installation der Programme sollte man den neuen Ordner in VSCode öffnen.
Man drückt nun *Ctrl+Shift+P / CMD+Shift+P* um in die Command Palette zu gelangen.
Dort wird `Task: Run Task`, um in den Task Modus zu kommen, eingegeben.
Man wählt den Task `install` aus und drückt Enter. Nun sollte sich das Terminal / Kommandozeilenfenster
öffnen. Hier gibt ihr nun euer Password an. Die nötigen Pakete sollte *NPM* automatisch
installieren.

Danach sollte der Task `run` ausgeführt werden. Dieser startet einen Developmentserver,
welcher über [http://localhost:4200](http://localhost:4200) zu erreichen ist.

### Mit der CLI

Nach Installation der Programme sollte man ein Terminal / Kommandozeilenfenster öffnen, in den
heruntergeladenen Ordner navigieren und dort `npm install` ausführen. Dieser Vorgang kann
einige Zeit in Anspruch nehmen.
Für das Accountmanagement wird außerdem ein zusätzliches Modul benötigt: `npm i ts-clipboard`.

Nach Abschluss des Befehls muss in dem selben Ordner `ng serve` ausgeführt werden, um einen
Developmentserver zu starten, welcher über [http://localhost:4200](http://localhost:4200) erreicht werden kann.
Sollte der Befehl nicht gefunden werden, kann der Server auch über `npm start` gestartet werden.

## VSCode

### Tasks

Visual Studio Code bietet
einem die Möglichkeit sogenannte Tasks einzustellen. Tasks erleichtern einen den Start
mit dem Projekt und dem Umgang mit der CLI. Ein Tasks-Tutorial findet ihr [hier](https://code.visualstudio.com/Docs/editor/tasks).
Wie auch schon beim Starten der Testumgebung, benötigen wir wieder die Command Palette (Zu öffnen mit *Ctrl+Shift+P / CMD+Shift+P*).

#### Build

Mittels dem Task `build` kann der Code kompiliert werden. Das Endprodukt wird im `dist/` Ordner gespeichert.

#### Testen

Über den Task `test` kann der Code mittels des Tools [Karma](https://karma-runner.github.io) getestet werden.

#### Ende-zu-Ende Tests

Ende-zu-Ende Tests können über den Task `e2e` mittels des Tools [Protractor](http://www.protractortest.org/) durchgeführt werden.

### Debugging

VSCode kommt mit einem integrierten [Debugger](https://code.visualstudio.com/Docs/editor/debugging).
Dieser ist bereits Konfiguriert. Man muss nur den Task `run` durchführen und dann
in die Debug-Sektion wechsel, um dort den Debug `Run` auszuwählen und ihn zu starten.

**!** Für den Debugger muss der Browser Chrome und die VSCode-Erweiterung *Debugger for Chrome*
installiert sein.

## Die Angular-CLI

Die Angular-CLI ist dabei behilflich Angular-Projekte zu verwalten. Man sollte sich also
zwingend zu einem bestimmten Grad mit ihr auskennen.

### Generieren neuer Komponenten

Über den Befehl `ng generate component component-name` (kurz: `ng g c component-name`) können neue Komponenten erstellt werden,
welche dann über *RouterLinks* als Unterseiten eingebunden werden können. Einzelheiten hierzu sind der 
Angular-Dokumentation zu entnehmen.

### Build

Mittels `ng build` kann der Code kompiliert werden. Das Endprodukt wird im `dist/` Ordner gespeichert.
Für einen Build im Produktionsmodus ist das `--prod` Argument zu übergeben.

### Testen

Über `ng test` kann der Code mittels des Tools [Karma](https://karma-runner.github.io) getestet werden.

### Ende-zu-Ende Tests

Ende-zu-Ende Tests können über den Befehl `ng e2e` mittels des Tools [Protractor](http://www.protractortest.org/) durchgeführt werden.

## Git und GitLab

Ein Einstieg in GitLab ist [hier](https://docs.google.com/document/d/1RHV6_kIPBn8KJtgoa5gXSHeQnF6EHVKDrMESMgIEvLg/) zu finden.

Ein Bot erstellt zu jedem Redmine-Ticket ein passendes GitLab Issue.

Es sollte eigentlich immer auf neuen Branches entwickelt werden. Also einfach einen Branch erstellen, dessen Name das Format
`<GitLab Name>-<Branch an dem gearbeitet wird>-<Ticket nummer/was gearbeitet wird (Optional)>`
(z.B. `FelixRewer-Loginbranch-#265` oder `USE-TO-Master`) hat. Diese Branches werden dann später in den jeweiligen
Branch per Request gemerged.

### Pipeline

Dieses Projekt ist mit einer Gitlab-CI Pipeline ausgestattet. Das bedeutet, dass nach jedem Push
der hochgeladene Code in einer Testumgebung ausgeführt wird. Somit erhält der Entwickler sofort Rückmeldung
ob sein Code funktioniert oder nicht. Das sieht man [hier](https://git.the-morpheus.de/development/website/commits/master) bei dem Häkchen neben jedem Commit

## Appendix

### Hinweise bezüglich der Browserkompatibilität

Jeder Frontend-Entwickler sollte neben seinem anderen Browsern vorgezogenen Lieblingsbrowser, seinen Code auch noch mit einem anderem Browser testen.
Wenn man einen WebKit Browser verwendet (Chrome, Chromium, Safari und Opera), sollte man auf einem Browser wie Firefox, Internet Explorer oder Edge
testen. Andersrum gilt dies natürlich auch. 

Warum? Weil WebKit sehr definiertes und langes CSS braucht. Firefox setzt aber automatisch Styles wo keine
sein sollten. Dies kann dazu führen das Dinge wie Flexbox oder Grid nicht richtig angezeigt werden.

Bevor man sehr neue oder sehr alte Dinge in seinem Code verwendet, ist es empfohlen das Tool "[Can I use](https://caniuse.com/)" zu verwenden.
Dort gibt man seine CSS Eigenschaft an und das Tool gibt ein Diagramm zurück, das anzeigt ob man eben diese Eigenschaft nutzen darf.

[CSS-Tricks](https://css-tricks.com) gibt Tipps für CSS/SCSS (z.B. Objekte-Zentrieren, Flex-Box, Grid etc.).

### Weitere Hilfe

Zu empfehlen ist die [Angular-Dokumentation](https://angular.io/docs). Hilfestellungen bei der CLI können entweder über `ng --help` oder der [Angular-CLI-Dokumentation](https://github.com/angular/angular-cli/wiki) erlangt werden.
