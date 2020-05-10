// tslint:disable:max-line-length
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DesktopMenuComponent } from './desktop/desktop-menu/desktop-menu.component';
import { DesktopStartmenuComponent } from './desktop/desktop-startmenu/desktop-startmenu.component';
import { ContextMenuComponent } from './desktop/context-menu/context-menu.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { DesktopGuard } from './desktop/desktop.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PXtoViewWidthPipe } from './pxto-view-width.pipe';
import { PXtoViewHeightPipe } from './pxto-view-height.pipe';
import { WindowFrameComponent } from './desktop/window/window-frame.component';
import { WindowManagerComponent } from './desktop/window-manager/window-manager.component';
import { TestWindowComponent } from './desktop/windows/test-window/test-window.component';
import { TerminalComponent } from './desktop/windows/terminal/terminal.component';
import { WindowPlaceDirective } from './desktop/window/window-place.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MinerComponent } from './desktop/windows/miner/miner.component';
import { SettingsComponent } from './desktop/windows/settings/settings.component';
import { TaskManagerComponent } from './desktop/windows/task-manager/task-manager.component';
import { AccountPageBaseComponent } from './account/account-page-base/account-page-base.component';
import { AccountGuard } from './account/account.guard';
import { DesignModule } from './design/design.module';
import { HardwareShopComponent } from './desktop/windows/hardware-shop/hardware-shop.component';
import { HardwareShopItemComponent } from './desktop/windows/hardware-shop/hardware-shop-item/hardware-shop-item.component';
import { HardwareShopItemListComponent } from './desktop/windows/hardware-shop/hardware-shop-item-list/hardware-shop-item-list.component';
import { HardwareShopHeaderComponent } from './desktop/windows/hardware-shop/hardware-shop-header/hardware-shop-header.component';
import { HardwareShopCartComponent } from './desktop/windows/hardware-shop/hardware-shop-cart/hardware-shop-cart.component';
import { HardwareShopCartItemComponent } from './desktop/windows/hardware-shop/hardware-shop-cart-item/hardware-shop-cart-item.component';
import { HardwareShopSidebarItemComponent } from './desktop/windows/hardware-shop/hardware-shop-sidebar-item/hardware-shop-sidebar-item.component';
import { WalletAppComponent } from './desktop/windows/wallet-app/wallet-app.component';
import { WalletAppHeaderComponent } from './desktop/windows/wallet-app/wallet-app-header/wallet-app-header.component';
import { WalletAppEditComponent } from './desktop/windows/wallet-app/wallet-app-edit/wallet-app-edit.component';
import { WalletAppTransactionComponent } from './desktop/windows/wallet-app/wallet-app-transaction/wallet-app-transaction.component';
import { HardwareShopSidebarComponent } from './desktop/windows/hardware-shop/hardware-shop-sidebar/hardware-shop-sidebar.component';
import { ControlCenterModule } from './control-center/control-center.module';
// tslint:enable:max-line-length

const routes: Routes = [
  { path: 'desktop', component: DesktopComponent, canActivate: [DesktopGuard], runGuardsAndResolvers: 'paramsOrQueryParamsChange' },
  { path: 'login', component: LoginComponent, canActivate: [AccountGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [AccountGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DesktopComponent,
    DesktopMenuComponent,
    DesktopStartmenuComponent,
    ContextMenuComponent,
    SignUpComponent,
    PXtoViewWidthPipe,
    PXtoViewHeightPipe,
    WindowFrameComponent,
    WindowManagerComponent,
    WindowPlaceDirective,
    TestWindowComponent,
    TerminalComponent,
    MinerComponent,
    SettingsComponent,
    TaskManagerComponent,
    AccountPageBaseComponent,
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
    HardwareShopSidebarComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    ControlCenterModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    ReactiveFormsModule,
    DesignModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
