import { Component, EventEmitter, Output } from '@angular/core';
import { WalletAppService } from '../wallet-app.service';
import { Wallet } from '../wallet';

@Component({
  selector: 'app-wallet-app-header',
  templateUrl: './wallet-app-header.component.html',
  styleUrls: ['./wallet-app-header.component.scss']
})
export class WalletAppHeaderComponent {

  wallet: Wallet;

  @Output()
  public walletEdit: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private walletAppService: WalletAppService
  ) {
    this.wallet = walletAppService.wallet;
  }

  showWalletEdit(): void {
    this.walletEdit.emit();
  }
}
