import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { WalletAppService } from '../wallet-app.service';
import { Wallet } from '../wallet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet-app-header',
  templateUrl: './wallet-app-header.component.html',
  styleUrls: ['./wallet-app-header.component.scss'],
})
export class WalletAppHeaderComponent implements OnDestroy {
  wallet: Wallet | null;

  @Input() walletEdit: boolean;
  @Output() walletEditChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  updateSubscription: Subscription;

  constructor(private walletAppService: WalletAppService) {
    this.wallet = walletAppService.wallet;
    this.updateSubscription = walletAppService.update.subscribe((wallet) => {
      this.wallet = wallet;
    });
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
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
