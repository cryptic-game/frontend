import { TerminalAPI, TerminalState } from './terminal-api';
import { DomSanitizer } from '@angular/platform-browser';

export abstract class ChoiceTerminalState implements TerminalState {
  choices: { [choice: string]: () => void };

  protected constructor(protected terminal: TerminalAPI) {}

  execute(command: string) {
    if (!command) {
      return;
    }

    if (this.choices[command]) {
      this.choices[command]();
    } else {
      this.invalidChoice(command);
    }
  }

  invalidChoice(choice: string) {
    this.terminal.outputText("'" + choice + "' is not one of the following: " + Object.keys(this.choices).join(', '));
  }

  autocomplete(content: string): string {
    return content
      ? Object.keys(this.choices)
          .sort()
          .find((choice) => choice.startsWith(content)) || ''
      : '';
  }

  getHistory(): string[] {
    return [];
  }

  abstract refreshPrompt(): void;
}

export class YesNoTerminalState extends ChoiceTerminalState {
  override choices = {
    yes: () => {
      this.terminal.popState();
      this.callback(true);
    },
    no: () => {
      this.terminal.popState();
      this.callback(false);
    },
  };

  constructor(terminal: TerminalAPI, private prompt: string, private callback: (response: boolean) => void) {
    super(terminal);
  }

  refreshPrompt() {
    this.terminal.changePrompt(this.prompt);
  }
}

export class BruteforceTerminalState extends ChoiceTerminalState {
  time = this.startSeconds;
  intervalHandle;
  override choices = {
    stop: () => {
      clearInterval(this.intervalHandle);
      this.terminal.popState();
      this.callback(true);
    },
    exit: () => {
      clearInterval(this.intervalHandle);
      this.terminal.popState();
      this.callback(false);
    },
  };

  constructor(
    terminal: TerminalAPI,
    private domSanitizer: DomSanitizer,
    private callback: (response: boolean) => void,
    private startSeconds: number = 0
  ) {
    super(terminal);

    this.intervalHandle = setInterval(() => {
      this.time += 1;
      this.refreshPrompt();
    }, 1000);
  }

  refreshPrompt() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    const prompt = `Bruteforcing ${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')} [stop/exit] `;
    this.terminal.changePrompt(`<span style="color: gold">${prompt}</span>`, true);
  }
}
