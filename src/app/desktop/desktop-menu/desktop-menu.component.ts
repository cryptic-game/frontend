import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-desktop-menu',
  templateUrl: './desktop-menu.component.html',
  styleUrls: ['./desktop-menu.component.scss']
})
export class DesktopMenuComponent implements OnInit {
  constructor() {}

  @Output()
  startmenu = new EventEmitter();

  ngOnInit() {}
}
