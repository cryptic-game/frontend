import {FullscreenOverlayContainer, OverlayContainer, OverlayModule,} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ContextMenuAttachDirective} from "./directive/context-menu.attach.directive";
import {ContextMenuComponent} from "./context-menu/context-menu.component";
import {ContextMenuContentComponent} from "./context-menu-content/context-menu-content.component";
import {ContextMenuItemDirective} from "./directive/contextMenu.item.directive";
import {IContextMenuOptions} from "./context-menu.options";
import {CONTEXT_MENU_OPTIONS} from "./context-menu.tokens";

@NgModule({
  declarations: [
    ContextMenuAttachDirective,
    ContextMenuComponent,
    ContextMenuContentComponent,
    ContextMenuItemDirective,
  ],
  entryComponents: [
    ContextMenuContentComponent,
  ],
  exports: [
    ContextMenuAttachDirective,
    ContextMenuComponent,
    ContextMenuItemDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
})
export class ContextMenuModule {
  public static forRoot(options?: IContextMenuOptions): ModuleWithProviders<ContextMenuModule> {
    return {
      ngModule: ContextMenuModule,
      providers: [
        {provide: CONTEXT_MENU_OPTIONS, useValue: options},
        {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
      ],
    };
  }
}
