# Official Cryptic Frontend

[![Build Status](https://travis-ci.org/cryptic-game/frontend.svg?branch=master)](https://travis-ci.org/cryptic-game/frontend)

This is the official [Cryptic](https://play.cryptic-game.net/) frontend ([available at docker-hub](https://hub.docker.com/r/crypticcp/frontend/)). It has been created with the **Angular** framework using _TypeScript_, _HTML_ and [SASS](http://sass-lang.com/guide).  

## Set up a development environment

NodeJS and NPM are required to compile and start the application. Refer to [https://nodejs.org/de/](https://nodejs.org/de/) for download/installation instructions. To get help, run `ng --help` or check the [Angular documentation](https://angular.io/docs) / [Angular CLI documentation](https://github.com/angular/angular-cli/wiki).

[Microsoft Visual Studio Code](https://code.visualstudio.com) is the recommended editor. Visual Studio Code (VSCode) provides a build-in debugger and a _git_ client.  

If you use VSCode**:  

1. Press _Ctrl+Shift+P / CMD+Shift+P_.
2. Type `Task: Run Task` to enter task mode. 
3. Run `install` to install all required dependencies. On Linux/Mac OSX you must type in your password.
4. Execute the task `run`, which starts an development server listening on [http://localhost:4200](http://localhost:4200).

If you use the **CLI**: 

1. Open the repository in the terminal. 
2. Run `npm install`. Brew a fresh coffee, because this process can take a bit time.
3. Run `ng serve` or `npm start` to start a development server listening on [http://localhost:4200](http://localhost:4200), .

Note: You can reate a new component using the command `ng generate component component-name` (short: `ng g c component-name`).

### Tasks

VSCode allows to create tasks, which can be very helpful to manage big projects without a _CLI_. Tasks can be executed via the command palette (open with _Ctrl+Shift+P / CMD+Shift+P_). Learn more in this [task tutorial](https://code.visualstudio.com/Docs/editor/tasks).

Tasks:  

- `build`: compiles and builds the whole project. The result will be stored in `dist/`.
- `test`: test your code with [Karma](https://karma-runner.github.io).

## Build & Test

- `ng build`: compiles and builds the whole project. The result will be stored in `dist/`. For production mode use the `--prod` argument.
- `ng test`: tests your code with [Karma](https://karma-runner.github.io).
- `ng e2e`: runs end-to-end tests with [Protractor](http://www.protractortest.org/).

## Check browser compatibility

To check browser-compatibility, use [Can I use](https://caniuse.com/). You should test your code at minimum with one WebKit browser (Chrome, Chromium, Safari, or Opera) and one non-WebKit browser (Firefox, Internet Explorer, or Edge). [CSS tricks](https://css-tricks.com) delivers tips for CSS/SCSS (e.g. centering, flex-box, grid etc.).

## Debugging

VSCode comes with a build-in, ready-to-use [debugger](https://code.visualstudio.com/Docs/editor/debugging)  that requires the  _Debugger for Chrome_  browser extension. To use it, run  the task `run`, switch to the debug section, and start `Run`.
