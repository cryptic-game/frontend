[![Build Status](https://travis-ci.org/cryptic-game/frontend.svg?branch=master)](https://travis-ci.org/cryptic-game/frontend)

This is the official frontend of Cryptic.

# Advice for Developers

This web application is created with the **Angular** framework. The Framework uses the languages _TypeScript_ (JavaScript with typing), _HTML_ and _SCSS_. A fundamental understanding of these languages is important to understand the code. _SCSS_ or [_Sass_](http://sass-lang.com/guide) is a CSS preprocessor. You can find a tutorial [here](https://www.toptal.com/sass/theming-scss-tutorial).

The framework also uses a **CLI** (_Comand Line Interface_). It helps creating and managing Angular projects fast.

## Editor

The project of course works with any editor, but we recommend the editor [VSCode](https://code.visualstudio.com) by Microsoft. Visual Studio Code also has a build-in debugger and a helpful _git_ support.

## Setting up an Development Environment

For compiling and starting of the application **NodeJS** and **NPM** are needed. Downloads and installation advice can be found on [https://nodejs.org/de/](https://nodejs.org/de/).

### With VSCode

After the installation of _Node_ an _NPM_ open the repository in VSCode. Press _Ctrl+Shift+P / CMD+Shift+P_ to open the command palette. Type `Task: Run Task` to enter task mode. The task `install` installs all dependencies needed.

**!** On Unix-based systems such as Linux or OS X you have to type in your password.

After this you can execute the task `run`. It starts an development server listening on [http://localhost:4200](http://localhost:4200).

### With the CLI

After the installation process open the repository in the terminal and run `npm install`. Make yourself a coffee, because this process can take a bit time.

To start a development server on [http://localhost:4200](http://localhost:4200) run `ng serve`. This is also possible with `npm start`.

## VSCode

### Tasks

Visual Studio Code offers the possibility to create tasks. Tasks can be very helpful to manage big projects without a _CLI_. Tasks can be executed via the command palette (open with _Ctrl+Shift+P / CMD+Shift+P_).

**!** [A task tutorial](https://code.visualstudio.com/Docs/editor/tasks)

#### Build

The task `build` compiles and builds the whole project. The result will be stored in `dist/`.

#### Testing

Via the task `test` code can be tested with [Karma](https://karma-runner.github.io).

#### End-to-End Testing

End-to-end tests can be made with `e2e` and [Protractor](http://www.protractortest.org/).

### Debugging

VSCode comes with a build-in [debugger](https://code.visualstudio.com/Docs/editor/debugging). It's already configured. The only thing you have to do is running the taks `run`, switching to the debug section and starting `Run`.

**!** For the debugger the extension _Debugger for Chrome_ must be installed.

## The Angular CLI

The Angualar CLI helps you managing Angular projects.

### Generating Components

The command `ng generate component component-name` (short: `ng g c component-name`) creates a new Component. Details can be found in the Angular documentation.

### Build

`ng build` compiles and builds the whole project. The result will be stored in `dist/`. For production mode use the `--prod` argument.

### Testing

Via `ng test` code can be tested with [Karma](https://karma-runner.github.io).

### End-to-End Testing

End-to-end tests can be made with `ng e2e` and [Protractor](http://www.protractortest.org/).

## Appendix

### Advice for browser compatibility

Every contributor should test his code minimum with one WebKit browser, such as Chrome, Chromium, Safari and Opera, and a non-WebKit browser, such as Firefox, Internet Explorer or Edge.

Before you use very new or old things in your code it's recommendet to use "[Can I use](https://caniuse.com/)". With this tool you can test the compatibility of your code.

[CSS tricks](https://css-tricks.com) delivers tipps for CSS/SCSS (e.g. centering, flex-box, grid etc.).

### Further help

The [Angular documentation](https://angular.io/docs) is very helpful. `ng --help` or the [Angular CLI documentation](https://github.com/angular/angular-cli/wiki) can help with the _CLI_.
