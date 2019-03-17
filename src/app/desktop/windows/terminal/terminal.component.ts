import {Component, ElementRef, OnInit, Type, ViewChild} from '@angular/core';
import {WindowDelegate} from '../../window/window-delegate';
import {TerminalPrograms} from './terminal-programs';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent extends WindowDelegate implements OnInit {

  @ViewChild('history') history: ElementRef;
  @ViewChild('prompt') prompt: ElementRef;
  @ViewChild('cmdLine') cmdLine: ElementRef;

  title = 'Terminal';
  icon = 'assets/desktop/img/terminal.svg';
  type: Type<any> = TerminalComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  output(html: string) {
    (this.history.nativeElement as HTMLElement).insertAdjacentHTML('beforeend', html + '<br>');
  }

  outputNode(node: Node) {
    (this.history.nativeElement as HTMLElement).appendChild(node);
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
    const args = command_.slice(1);
    if (TerminalPrograms.programs.hasOwnProperty(command_[0].toLowerCase())) {
      TerminalPrograms.programs[command_[0].toLowerCase()](args, this.output.bind(this));
    } else {
      this.output('Command could not be found.');
    }
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

}