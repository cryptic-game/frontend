import { Component, OnInit, Input } from '@angular/core';
import { Position } from '../../../dataclasses/position.class';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  contextMenu: boolean = false;

  @Input() 
  contextMenuPosition: Position;

  @Input() 
  contextMenuTarget: EventTarget;

  constructor() { }

  ngOnInit() {
  }

  showContextMenu(e: MouseEvent) {
    console.log("rightClick");

    this.contextMenuPosition = new Position(e.x, e.y);
    this.contextMenuTarget = e.target;
    this.contextMenu = true;

    console.log(this.contextMenu);

    return false;
  }

  hideContextMenu() {
    console.log("hide");

    this.contextMenuPosition = null;
    this.contextMenuTarget = null;
    this.contextMenu = false;

    console.log(this.contextMenu);
  }

}
