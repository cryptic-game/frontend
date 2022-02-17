import {SettingsService} from '../settings/settings.service';
import {Component, ElementRef, OnInit, SecurityContext, Type, ViewChild} from '@angular/core';
import {WindowComponent, WindowDelegate} from '../../window/window-delegate';
import {TerminalAPI, TerminalState} from './terminal-api';
import {DefaultTerminalState} from './terminal-states';
import {WebsocketService} from '../../../websocket.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FileService} from '../../../api/files/file.service';
import {WindowManager} from '../../window-manager/window-manager';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent extends WindowComponent implements OnInit, TerminalAPI {
  @ViewChild('history', {static: true}) history: ElementRef;
  @ViewChild('prompt', {static: true}) prompt: ElementRef;
  @ViewChild('cmdLine', {static: true}) cmdLine: ElementRef;

  currentState: TerminalState[] = [];
  promptHtml: SafeHtml;

  historyIndex = -1;

  constructor(
    private websocket: WebsocketService,
    private settings: SettingsService,
    private fileService: FileService,
    private windowManager: WindowManager,
    private domSanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
    this.pushState(
      new DefaultTerminalState(
        this.websocket,
        this.settings,
        this.fileService,
        this.domSanitizer,
        this.delegate,
        this.delegate.device,
        this
      )
    );
    this.getState().refreshPrompt();
    this.focusCommandLine();
  }

  focusCommandLine() {
    if (window.getSelection()!.type !== 'Range') {
      this.cmdLine.nativeElement.focus();
    }
    this.getState().refreshPrompt();
  }

  changePrompt(prompt: string | SafeHtml, trust = false) {
    if (trust && typeof prompt === 'string') {
      this.promptHtml = this.domSanitizer.bypassSecurityTrustHtml(prompt);
      return;
    }

    if (typeof prompt === 'string') {
      // @ts-ignore
      this.promptHtml = this.domSanitizer.sanitize(
        SecurityContext.HTML,
        prompt
      );
    } else {
      this.promptHtml = prompt;
    }
  }

  pushState(state: TerminalState) {
    this.currentState.push(state);
    state.refreshPrompt();
  }

  popState(): TerminalState {
    const popped = this.currentState.pop()!;
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
      this.cmdLine.nativeElement.value =
        this.historyIndex > -1 ? this.getHistory()[this.historyIndex] : '';
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
    this.windowManager.closeWindow(this.delegate);
  }

  clear() {
    this.history.nativeElement.value = '';
  }
}

export class TerminalWindowDelegate extends WindowDelegate {
  title = 'Terminal';
  icon = 'assets/desktop/img/terminal.svg';
  type: Type<any> = TerminalComponent;
}
