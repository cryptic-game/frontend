import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { WindowDelegate } from '../../window/window-delegate';
import { TerminalAPI } from './terminal-api';
import { WindowManagerService } from '../../window-manager/window-manager.service';
import { TerminalCommandsService } from './terminal-commands.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent extends WindowDelegate
  implements OnInit, TerminalAPI {
  @ViewChild('history') history: ElementRef;
  @ViewChild('prompt') prompt: ElementRef;
  @ViewChild('cmdLine') cmdLine: ElementRef;

  title = 'Terminal';
  icon = 'assets/desktop/img/terminal.svg';
  type: Type<any> = TerminalComponent;

  promptText = '';

  protocol: string[] = [];
  historyIndex = -1;

  constructor(
    private windowManager: WindowManagerService,
    private commandsService: TerminalCommandsService
  ) {
    super();
  }

  ngOnInit() {
    this.refreshPrompt();
  }

  refreshPrompt() {
    this.promptText =
      sessionStorage.getItem('username') +
      '@' +
      JSON.parse(sessionStorage.getItem('activeDevice')).name +
      ' $';
  }

  getHistory() {
    return this.protocol.slice(0);
  }

  enter(content: string) {
    this.outputNode((this.prompt.nativeElement as HTMLElement).cloneNode(true));
    this.outputNode(document.createTextNode(content));
    this.outputNode(document.createElement('br'));
    this.cmdLine.nativeElement.value = '';
    this.cmdLine.nativeElement.scrollIntoView();
    this.execute(content);
  }

  autocomplete(content: string) {
    const command: string = content
      ? Object.keys(this.commandsService.programs)
        .filter(n => !['chaozz'].includes(n))
        .sort()
        .find(n => n.startsWith(content))
      : '';
    this.cmdLine.nativeElement.value = command
      ? command
      : this.cmdLine.nativeElement.value;
  }

  previousFromHistory() {
    if (this.historyIndex < this.protocol.length - 1) {
      this.historyIndex++;
      this.cmdLine.nativeElement.value = this.protocol[this.historyIndex];
    }
  }

  nextFromHistory() {
    if (this.historyIndex > -1) {
      this.historyIndex--;
      this.cmdLine.nativeElement.value =
        this.historyIndex > -1 ? this.protocol[this.historyIndex] : '';
    }
  }

  execute(command: string) {
    const command_ = command.split(' ');
    if (command_.length === 0) {
      return;
    }
    this.commandsService.execute(command_[0], command_.slice(1), this);
    if (command) {
      this.protocol.unshift(command);
    }
  }

  output(html: string) {
    this.outputRaw(html + '<br>');
  }

  outputRaw(html: string) {
    (this.history.nativeElement as HTMLElement).insertAdjacentHTML(
      'beforeend',
      html
    );
  }

  outputText(text: string) {
    (this.history.nativeElement as HTMLElement).insertAdjacentText(
      'beforeend',
      text
    );
    this.outputRaw('<br>');
  }

  outputNode(node: Node) {
    (this.history.nativeElement as HTMLElement).appendChild(node);
  }

  closeTerminal() {
    this.windowManager.closeWindow(this);
  }

  clear() {
    this.history.nativeElement.value = '';
  }

}
