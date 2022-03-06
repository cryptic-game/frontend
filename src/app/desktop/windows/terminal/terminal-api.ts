import {SafeHtml} from '@angular/platform-browser';

export interface TerminalAPI {
  /**
   * Outputs html to the terminal (followed by a line break)
   * @param html HTML string
   */
  output(html: string): void;

  /**
   * Outputs html without a line break to the terminal
   * @param html HTML string
   */
  outputRaw(html: string): void;

  /**
   * Outputs text to the terminal
   * @param text Raw text
   */
  outputText(text: string): void;

  /**
   * Outputs a html node to the terminal
   * @param node `Node`
   */
  outputNode(node: Node): void;

  /**
   * Closes the terminal window
   */
  closeTerminal(): void;

  /**
   * Clears the complete terminal
   */
  clear(): void;

  changePrompt(prompt: string | SafeHtml, trust?: boolean): void;

  pushState(state: TerminalState): void;

  popState(): TerminalState;
}


export interface TerminalState {
  execute(command: string): void;

  autocomplete(content: string): string;

  getHistory(): string[];

  refreshPrompt(): void;
}
