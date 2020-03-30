import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletAppService } from '../wallet-app.service';
import { Wallet } from '../wallet';

@Component({
  selector: 'app-wallet-app-header',
  templateUrl: './wallet-app-header.component.html',
  styleUrls: ['./wallet-app-header.component.scss']
})
export class WalletAppHeaderComponent {

  wallet: Wallet;
  @Input()
  isWalletEdit: boolean;

  @Output()
  public walletEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private walletAppService: WalletAppService
  ) {
    walletAppService.update.subscribe((wallet) => {
      this.wallet = wallet;
      this.isWalletEdit = false;
    });
  }

  showWalletEdit(): void {
    this.walletEdit.emit(true);
    this.isWalletEdit = true;
  }

  hideWalletEdit(): void {
    this.walletEdit.emit(false);
    this.isWalletEdit = false;
  }
}
