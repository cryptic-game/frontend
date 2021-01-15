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

  @Input() walletEdit: boolean;
  @Output() walletEditChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private walletAppService: WalletAppService) {
    walletAppService.update.subscribe((wallet) => {
      this.wallet = wallet;
    });
  }

  showWalletEdit(): void {
    this.walletEdit = true;
    this.walletEditChange.emit(true);
  }

  hideWalletEdit(): void {
    this.walletEdit = false;
    this.walletEditChange.emit(false);
  }
}
