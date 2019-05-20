import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { WindowDelegate } from '../../window/window-delegate';
import { TerminalAPI, TerminalState } from './terminal-api';
import { WindowManagerService } from '../../window-manager/window-manager.service';
import { DefaultTerminalState } from './terminal-states';
import { WebsocketService } from '../../../websocket.service';

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

  currentState: TerminalState[] = [];
  promptText = '';

  historyIndex = -1;

  constructor(
    private websocket: WebsocketService,
    private windowManager: WindowManagerService
  ) {
    super();
  }

  ngOnInit() {
    this.pushState(new DefaultTerminalState(this.websocket, this,
      JSON.parse(sessionStorage.getItem('activeDevice')), sessionStorage.getItem('username')));
    this.getState().refreshPrompt();
  }

  changePrompt(prompt: string) {
    this.promptText = prompt;
  }

  pushState(state: TerminalState) {
    this.currentState.push(state);
  }

  popState(): TerminalState {
    const popped = this.currentState.pop();
    if (this.currentState.length === 0) {
      this.closeTerminal();
    }
    return popped;
  }

  getState() {
    return this.currentState[this.currentState.length - 1];
  }

  getHistory() {
    return this.getState().getHistory();
  }

  enter(content: string) {
    this.outputNode((this.prompt.nativeElement as HTMLElement).cloneNode(true));
    this.outputNode(document.createTextNode(content));
    this.outputNode(document.createElement('br'));
    this.cmdLine.nativeElement.value = '';
    this.execute(content);
    this.cmdLine.nativeElement.scrollIntoView();
    this.historyIndex = -1;
  }

  autocomplete(content: string) {
    const completed = this.getState().autocomplete(content);
    if (completed) {
      this.cmdLine.nativeElement.value = completed;
    }
  }

  previousFromHistory() {
    if (this.historyIndex < this.getHistory().length - 1) {
      this.historyIndex++;
      this.cmdLine.nativeElement.value = this.getHistory()[this.historyIndex];
      this.cmdLine.nativeElement.scrollIntoView();
    }
  }

  nextFromHistory() {
    if (this.historyIndex > -1) {
      this.historyIndex--;
      this.cmdLine.nativeElement.value = this.historyIndex > -1 ? this.getHistory()[this.historyIndex] : '';
      this.cmdLine.nativeElement.scrollIntoView();
    }
  }

  execute(command: string) {
    this.getState().execute(command);
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
