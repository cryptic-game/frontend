import { Position } from '../../dataclasses/position.class';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProgramLinkage } from '../../dataclasses/programlinkage.class';
import { ProgramService } from './program.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  constructor(private programService: ProgramService) {}

  startMenu = false;

  contextMenu = false;
  contextMenuPosition = new Position(0, 0);
  contextMenuTarget: EventTarget;

  @ViewChild('surface')
  surface: ElementRef;

  linkages: ProgramLinkage[] = []; // array for all linkages on the desktop

  drag: HTMLElement; // the dragged element
  index: number; // index of the dragged element
  position: Position; // position of the dragged element

  token: string =
    sessionStorage.getItem('token') || localStorage.getItem('token');

  ngOnInit(): void {
    this.programService.list(this.token).subscribe(data => {
      data.forEach(el => {
        const position = new Position(el.position.x, el.position.y);
        const linkage = new ProgramLinkage(
          el.name,
          el.image,
          el.name,
          el.on_surface,
          position
        );

        this.linkages.push(linkage);
      });
    });
  }

  onDesktop(): ProgramLinkage[] {
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

  mouseup(e: MouseEvent): void {
    const data = new FormData();
    data.append('image', this.linkages[this.index].getIcon());
    data.append('name', this.linkages[this.index].getDisplayName());
    data.append('position_x', (e.pageX - this.position.getX()).toString());
    data.append('position_y', (e.pageY - this.position.getY()).toString());
    data.append('on_surface', 'true');

    this.programService.update(this.token, data).subscribe();

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
