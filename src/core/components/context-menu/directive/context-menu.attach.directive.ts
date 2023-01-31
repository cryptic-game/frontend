import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuService } from '../context-menu.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Directive({
  // TODO:
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[contextMenu]',
})
export class ContextMenuAttachDirective {
  @Input() public contextMenuSubject: any;
  @Input() public contextMenu: ContextMenuComponent;

  constructor(private readonly contextMenuService: ContextMenuService) {}

  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    if (!this.contextMenu.disabled) {
      this.contextMenuService.show.next({
        contextMenu: this.contextMenu,
        event,
        item: this.contextMenuSubject,
      });
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
