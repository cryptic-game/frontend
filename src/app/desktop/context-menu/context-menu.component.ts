import { Component, Input, OnInit } from '@angular/core';
import { Position } from '../../../dataclasses/position';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @Input('position') position: Position = new Position(0, 0);

  constructor() {
  }

  ngOnInit() {
  }
}
