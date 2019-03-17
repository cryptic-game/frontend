import {Component, ElementRef, OnInit, Type, ViewChild} from '@angular/core';
import {WindowDelegate} from '../../window/window-delegate';
import {TerminalAPI} from './terminal-api';
import {WindowManagerService} from '../../window-manager/window-manager.service';
import {TerminalCommandsService} from './terminal-commands.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent extends WindowDelegate implements OnInit, TerminalAPI {

  @ViewChild('history') history: ElementRef;
  @ViewChild('prompt') prompt: ElementRef;
  @ViewChild('cmdLine') cmdLine: ElementRef;

  title = 'Terminal';
  icon = 'assets/desktop/img/terminal.svg';
  type: Type<any> = TerminalComponent;

  promptText = 'Chaozz@Home-Desk:';

  constructor(private windowManager: WindowManagerService, private commandsService: TerminalCommandsService) {
    super();
  }

  ngOnInit() {
  }

  promptKeyPressed(event: KeyboardEvent, content: string) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      event.preventDefault();
      this.outputNode((this.prompt.nativeElement as HTMLElement).cloneNode(true));
      const historyCmdLine = (this.cmdLine.nativeElement as HTMLElement).cloneNode(true);
      (historyCmdLine as HTMLElement).removeAttribute('contenteditable');
      this.outputNode(historyCmdLine);
      this.outputNode(document.createElement('br'));
      this.cmdLine.nativeElement.innerText = '';
      this.execute(content);
    }
  }

  execute(command: string) {
    const command_ = command.split(' ');
    if (command_.length === 0) {
      return;
    }
    this.commandsService.execute(command_[0], command_.slice(1), this);
  }

  focusContentEditable(el: HTMLElement) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }


  output(html: string) {
    this.outputRaw(html + '<br>');
  }

  outputRaw(html: string) {
    (this.history.nativeElement as HTMLElement).insertAdjacentHTML('beforeend', html);
  }

  outputText(text: string) {
    (this.history.nativeElement as HTMLElement).insertAdjacentText('beforeend', text);
  }

  outputNode(node: Node) {
    (this.history.nativeElement as HTMLElement).appendChild(node);
  }

  closeTerminal() {
    this.windowManager.closeWindow(this);
  }

  changePrompt(text: string) {
    this.promptText = text;
  }

  resetPrompt() {
    // TODO
  }

}
