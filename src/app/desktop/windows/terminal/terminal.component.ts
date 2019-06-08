import { Component, ElementRef, OnInit, SecurityContext, Type, ViewChild } from '@angular/core';
import { WindowDelegate } from '../../window/window-delegate';
import { TerminalAPI, TerminalState } from './terminal-api';
import { WindowManagerService } from '../../window-manager/window-manager.service';
import { DefaultTerminalState } from './terminal-states';
import { WebsocketService } from '../../../websocket.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  promptHtml: SafeHtml;

  historyIndex = -1;

  constructor(
    private websocket: WebsocketService,
    private windowManager: WindowManagerService,
    private domSanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
    this.pushState(new DefaultTerminalState(this.websocket, this.domSanitizer, this,
      JSON.parse(sessionStorage.getItem('activeDevice')), sessionStorage.getItem('username')));
    this.getState().refreshPrompt();
  }

  focusCommandLine() {
    if (window.getSelection().type !== 'Range') {
      this.cmdLine.nativeElement.focus();
    }
  }

  changePrompt(prompt: string | SafeHtml, trust: boolean = false) {
    if (trust && typeof prompt === 'string') {
      this.promptHtml = this.domSanitizer.bypassSecurityTrustHtml(prompt);
      return;
    }

    if (typeof prompt === 'string') {
      this.promptHtml = this.domSanitizer.sanitize(SecurityContext.HTML, prompt);
    } else {
      this.promptHtml = prompt;
    }
  }

  pushState(state: TerminalState) {
    this.currentState.push(state);
    state.refreshPrompt();
  }

  popState(): TerminalState {
    const popped = this.currentState.pop();
    if (this.currentState.length === 0) {
      this.closeTerminal();
      return popped;
    }
    this.getState().refreshPrompt();
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
    this.cmdLine.nativeElement.scrollIntoView();
  }

  outputText(text: string) {
    (this.history.nativeElement as HTMLElement).insertAdjacentText(
      'beforeend',
      text
    );
    this.outputRaw('<br>');
    this.cmdLine.nativeElement.scrollIntoView();
  }

  outputNode(node: Node) {
    (this.history.nativeElement as HTMLElement).appendChild(node);
    this.cmdLine.nativeElement.scrollIntoView();
  }

  closeTerminal() {
    this.windowManager.closeWindow(this);
  }

  clear() {
    this.history.nativeElement.value = '';
  }

}
