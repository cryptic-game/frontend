import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DesktopRoutingModule} from "./desktop-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DesktopComponent} from './desktop.component';
import {DesktopMenuComponent} from './desktop-menu/desktop-menu.component';
import {DesktopStartmenuComponent} from './desktop-startmenu/desktop-startmenu.component';
import {WindowFrameComponent} from './window/window-frame.component';
import {WindowManagerComponent} from './window-manager/window-manager.component';
import {WindowPlaceDirective} from './window/window-place.directive';
import {TestWindowComponent} from './windows/test-window/test-window.component';
import {TerminalComponent} from './windows/terminal/terminal.component';
import {MinerComponent} from './windows/miner/miner.component';
import {SettingsComponent} from './windows/settings/settings.component';
import {TaskManagerComponent} from './windows/task-manager/task-manager.component';
import {HardwareShopItemComponent} from './windows/hardware-shop/hardware-shop-item/hardware-shop-item.component';
import {
  HardwareShopCartItemComponent
} from './windows/hardware-shop/hardware-shop-cart-item/hardware-shop-cart-item.component';
import {HardwareShopCartComponent} from './windows/hardware-shop/hardware-shop-cart/hardware-shop-cart.component';
import {HardwareShopHeaderComponent} from './windows/hardware-shop/hardware-shop-header/hardware-shop-header.component';
import {
  HardwareShopItemListComponent
} from './windows/hardware-shop/hardware-shop-item-list/hardware-shop-item-list.component';
import {HardwareShopComponent} from './windows/hardware-shop/hardware-shop.component';
import {
  HardwareShopSidebarItemComponent
} from './windows/hardware-shop/hardware-shop-sidebar-item/hardware-shop-sidebar-item.component';
import {WalletAppComponent} from "./windows/wallet-app/wallet-app.component";
import {WalletAppHeaderComponent} from "./windows/wallet-app/wallet-app-header/wallet-app-header.component";
import {WalletAppEditComponent} from "./windows/wallet-app/wallet-app-edit/wallet-app-edit.component";
import {
  WalletAppTransactionComponent
} from "./windows/wallet-app/wallet-app-transaction/wallet-app-transaction.component";
import {
  HardwareShopSidebarComponent
} from "./windows/hardware-shop/hardware-shop-sidebar/hardware-shop-sidebar.component";
import {EditorComponent} from "./windows/editor/editor.component";
import {FileManagerComponent} from "./windows/file-manager/file-manager.component";
import {ContextMenuModule} from "../../core/components/context-menu/context-menu.module";
import {PxToModule} from "../../core/px-to/px-to.module";

@NgModule({
  declarations: [
    DesktopComponent,
    DesktopMenuComponent,
    DesktopStartmenuComponent,
    WindowFrameComponent,
    WindowManagerComponent,
    WindowPlaceDirective,
    TestWindowComponent,
    TerminalComponent,
    MinerComponent,
    SettingsComponent,
    TaskManagerComponent,
    HardwareShopComponent,
    HardwareShopItemComponent,
    HardwareShopItemListComponent,
    HardwareShopHeaderComponent,
    HardwareShopCartComponent,
    HardwareShopCartItemComponent,
    HardwareShopHeaderComponent,
    HardwareShopItemComponent,
    HardwareShopItemListComponent,
    HardwareShopSidebarItemComponent,
    WalletAppComponent,
    WalletAppHeaderComponent,
    WalletAppEditComponent,
    WalletAppTransactionComponent,
    HardwareShopSidebarComponent,
    EditorComponent,
    FileManagerComponent
  ],
  imports: [
    CommonModule,
    DesktopRoutingModule,
    ReactiveFormsModule,
    ContextMenuModule,
    FormsModule,
    PxToModule
  ]
})
export class DesktopModule {
}
