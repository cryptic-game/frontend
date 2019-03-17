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

}
