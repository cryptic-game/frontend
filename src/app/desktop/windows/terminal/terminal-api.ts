export interface TerminalAPI {
  /**
   * Outputs html to the terminal (followed by a line break)
   * @param html HTML string
   */
  output(html: string);

  /**
   * Outputs html without a line break to the terminal
   * @param html HTML string
   */
  outputRaw(html: string);

  /**
   * Outputs text to the terminal
   * @param text Raw text
   */
  outputText(text: string);

  /**
   * Outputs a html node to the terminal
   * @param node `Node`
   */
  outputNode(node: Node);

  /**
   * Closes the terminal window
   */
  closeTerminal();

  /**
   * Changes the prompt text in the terminal
   * @param text
   */
  changePrompt(text: string);

  /**
   * Resets the prompt text in the terminal to the default
   */
  resetPrompt();

  /**
   * Clears the complete terminal
   */
  clear();

  /**
   * Refresh the prompt
   */
  refreshPrompt();

}
