# Official Cryptic Frontend

![GitHub Build Action Workflow Status](https://img.shields.io/github/workflow/status/cryptic-game/frontend/Main?style=flat-square)

This is the official [Cryptic frontend](https://play.cryptic-game.net/) (available on [Docker Hub](https://hub.docker.com/r/crypticcp/frontend/)). It has been created with the **Angular** framework using _TypeScript_, _HTML_ and [SASS](http://sass-lang.com/guide).  

## Set up a development environment

NodeJS and NPM are required to compile and start the application. Refer to [https://nodejs.org/de/](https://nodejs.org/de/) for download/installation instructions. To get help, run `ng --help` or check the [Angular documentation](https://angular.io/docs) / [Angular CLI documentation](https://github.com/angular/angular-cli/wiki).

- [Microsoft Visual Studio Code](https://code.visualstudio.com) is the recommended editor. It provides a built-in debugger (see [debugging](#debugging)) and integrates a _git_ client.  
- [WebStorm](https://www.jetbrains.com/webstorm/) (paid or student license) 

If you use **VSCode**:  

1. Press _Ctrl+Shift+P / CMD+Shift+P_.
2. Type `Task: Run Task` to enter task mode. 
3. Run `install` to install all required dependencies. On Linux/Mac OSX you must type in your password.
4. Execute the task `run`, which starts an development server listening on [http://localhost:4200](http://localhost:4200).

If you use the **CLI**: 

1. Open the repository in the terminal. 
2. Run `npm install`. Brew a fresh coffee, because this process can take some time.
3. Run `ng serve` or `npm start` to start a development server listening on [http://localhost:4200](http://localhost:4200). 

If you use **WebStorm**:

1. Click File -> New -> Project from Version Control (Welcome Screen: `Get from VSC`)
2. Paste the [GitHub repository url](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/GitHub-URL-find-use-example).
3. Press Shift twice. Run `npm install`. 
4. Click the green play button in the top right to start the Angular CLI Server. 

Note: Create a new component with the command `ng generate component component-name` (short: `ng g c component-name`).

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

To check browser-compatibility, use [Can I use](https://caniuse.com/). You should test your code at minimum with one WebKit browser (Chrome, Chromium, Safari, or Opera) and one non-WebKit browser (Firefox or Microsoft Edge). 

Note: [CSS tricks](https://css-tricks.com) delivers tips for CSS/SCSS (e.g. centering, flex-box, grid etc.).

## Debugging

VSCode comes with a built-in, ready-to-use [debugger](https://code.visualstudio.com/Docs/editor/debugging)  that requires the  _Debugger for Chrome_ browser extension. To use it, run  the task `run`, switch to the debug section, and start `Run`.
