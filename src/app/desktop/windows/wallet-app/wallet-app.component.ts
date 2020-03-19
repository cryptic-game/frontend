import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { WalletAppService } from './wallet-app.service';
import { Wallet } from './wallet';
import { interval } from 'rxjs';
import { Transaction } from './transaction';

@Component({
  selector: 'app-wallet-app',
  templateUrl: './wallet-app.component.html',
  styleUrls: ['./wallet-app.component.scss']
})
export class WalletAppComponent extends WindowComponent implements OnInit {

  walletEdit: boolean;
  wallet: Wallet;
  transactions: Transaction[];

  constructor(
    private walletAppService: WalletAppService
  ) {
    super();
    walletAppService.updateWallet().then((loaded) => {
      if (loaded) {
        this.setWalletEditStatus(false);
      } else {
        this.setWalletEditStatus(true);
      }
    });

    this.wallet = walletAppService.wallet;

    walletAppService.update.subscribe((wallet) => {
      this.wallet = wallet;
      if (wallet) {
        this.setWalletEditStatus(false);
      }
    });
    this.transactions = [];
  }

  ngOnInit() {
    interval(1000 * 15).subscribe(() => this.walletAppService.updateWallet());
  }

  setWalletEditStatus(status: boolean): void {
    this.walletEdit = status;
  }
}

export class WalletAppWindowDelegate extends WindowDelegate {
  title = 'Wallet';
  icon = 'assets/desktop/img/wallet_app.svg';
  type: Type<any> = WalletAppComponent;
}
