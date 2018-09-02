import { ProgramService } from './../program.service';
import { Position } from './../../../dataclasses/position.class';
import { ProgramLinkage } from './../../../dataclasses/programlinkage.class';
import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-desktop-surface',
  templateUrl: './desktop-surface.component.html',
  styleUrls: ['./desktop-surface.component.scss']
})
export class DesktopSurfaceComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private programService: ProgramService
  ) {}

  @ViewChild('surface')
  surface: ElementRef;

  linkages: Array<ProgramLinkage> = new Array(); // array for all linkages on the desktop

  drag: HTMLElement; // the dragged element
  position: Position; // position of this.drag

  token: string =
    sessionStorage.getItem('token') || localStorage.getItem('token');

  ngOnInit(): void {
    this.programService.list(this.token).subscribe(data => {
      data.filter(el => el.on_surface).forEach(el => {
        const position = new Position(el.position.x, el.position.y);
        const linkage = new ProgramLinkage(
          el.name,
          el.image,
          el.name,
          position
        );

        this.linkages.push(linkage);
      });
    });
  }

  mousedown(e: MouseEvent): void {
    this.drag = e.target as HTMLElement;
    this.position = new Position(e.offsetX, e.offsetY);

    Array.from(this.surface.nativeElement.children).forEach(el =>
      this.renderer.setStyle(el, 'zIndex', '0')
    );
    this.renderer.setStyle(this.drag, 'zIndex', '1');
  }

  mouseup(e: MouseEvent): void {
    const data = new FormData();
    data.append('image', this.drag.querySelector('img').getAttribute('src'));
    data.append('name', this.drag.innerText);
    data.append('position_x', (e.pageX - this.position.getX()).toString());
    data.append('position_y', (e.pageY - this.position.getY()).toString());
    data.append('on_surface', 'true');

    this.programService.update(this.token, data).subscribe();

    this.drag = undefined;
    this.position = undefined;
  }

  mousemove(e: MouseEvent): void {
    if (this.drag) {
      this.renderer.setStyle(
        this.drag,
        'top',
        `${e.pageY - this.position.getY()}px`
      );
      this.renderer.setStyle(
        this.drag,
        'left',
        `${e.pageX - this.position.getX()}px`
      );
    }
  }

  /*@ViewChild('surface')
  surface: ElementRef;

  setLinkage(linkage: ProgramLinkage): void {
    const linkageAlias = this.renderer.createElement('div');
    const linkageImg = this.renderer.createElement('img');

    this.renderer.appendChild(this.surface, linkageAlias);
    this.renderer.appendChild(linkageAlias, linkageImg);

    linkageAlias.style.left = `${linkage.getPosition().getX()}px`;
    linkageAlias.style.top = `${linkage.getPosition().getY()}px`;
    linkageAlias.style.position = 'absolute';
    linkageAlias.style.width = '64px';
    linkageAlias.style.height = '64px';
    linkageAlias.style.textAlign = 'center';
    linkageAlias.style.fontSize = '11pt';
    linkageAlias.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    linkageAlias.style.userSelect = 'none';
    linkageAlias.style.display = 'flex';
    linkageAlias.style.flexDirection = 'column';
    linkageAlias.style.alignItems = 'center';
    linkageAlias.style.justifyContent = 'center';

    Array.from(linkageAlias.children).forEach(el => {
      (el as HTMLElement).style.pointerEvents = 'none';
    });

    linkageImg.style.width = '45px';
    linkageImg.style.height = '45px';

    linkageAlias.addEventListener('mousedown', e => {
      this.dragEl = linkageAlias;

      this.dragEl.style.backgroundColor = 'rgba(0, 0, 0, 0.45)';
      this.dragEl.style.boxShadow = 'inset 0px 0px 2px 2px rgba(0, 0, 0, 0.45)';
      this.dragEl.style.borderRadius = '10px';
      this.dragEl.style.color = '#ddd';

      this.dragElPosition = new Position(e.offsetX, e.offsetY);
    });

    this.surface.nativeElement.addEventListener('mousemove', e => {
      if (this.dragEl) {
        this.dragEl.style.left = `${e.pageX - this.dragElPosition.getX()}px`;
        this.dragEl.style.top = `${e.pageY - this.dragElPosition.getY()}px`;
      }
    });

    linkageAlias.addEventListener('mouseup', () => {
      this.dragEl.style.backgroundColor = 'transparent';
      this.dragEl.style.boxShadow = 'none';
      this.dragEl.style.color = '#000';

      this.dragEl = undefined;
      this.dragElPosition = undefined;
    });
  }*/
}
