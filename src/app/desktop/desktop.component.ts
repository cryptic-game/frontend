import { Position } from '../../dataclasses/position.class';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Program } from '../../dataclasses/program.class';
import { ProgramService } from './program.service';
import {WindowManagerService} from './window-manager/window-manager.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  constructor(private programService: ProgramService, public windowManager: WindowManagerService) {
  }

  startMenu = false;

  contextMenu = false;
  contextMenuPosition = new Position(0, 0);
  contextMenuTarget: EventTarget;

  @ViewChild('surface')
  surface: ElementRef;

  linkages: Program[] = []; // array for all linkages on the desktop

  drag: HTMLElement; // the dragged element
  index: number; // index of the dragged element
  position: Position; // position of the dragged element

  token: string =
    sessionStorage.getItem('token') || localStorage.getItem('token');

  ngOnInit(): void {
    this.linkages = this.programService.list();
  }

  onDesktop(): Program[] {
    return this.linkages.filter(item => item.onDesktop());
  }

  toggleStartMenu(): void {
    this.startMenu = !this.startMenu;
  }

  hideStartMenu(): void {
    this.startMenu = false;
  }

  showContextMenu(e: MouseEvent): boolean {
    this.contextMenuPosition = new Position(e.pageX, e.pageY);
    this.contextMenuTarget = e.target;
    this.contextMenu = true;

    this.mouseup();

    return false;
  }

  hideContextMenu(): void {
    this.contextMenu = false;
  }

  mousedown(e: MouseEvent, i: number): void {
    this.index = i;
    this.position = new Position(e.offsetX, e.offsetY);

    this.linkages.forEach(el => {
      el.getPosition().setZ(0);
    });
    this.linkages[this.index].getPosition().setZ(1);
  }

  mouseup(): void {
    if (this.index !== undefined) {
      this.programService.update(this.linkages[this.index]);
    }

    this.index = undefined;
    this.position = undefined;
  }

  mousemove(e: MouseEvent): void {
    if (this.index !== undefined) {
      this.linkages[this.index]
        .getPosition()
        .setX(e.pageX - this.position.getX());
      this.linkages[this.index]
        .getPosition()
        .setY(e.pageY - this.position.getY());
    }
  }
}
