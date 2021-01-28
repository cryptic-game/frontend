import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { WalletAppService } from './wallet-app.service';
import { Wallet } from './wallet';
import { Transaction } from './transaction';

@Component({
  selector: 'app-wallet-app',
  templateUrl: './wallet-app.component.html',
  styleUrls: ['./wallet-app.component.scss']
})
export class WalletAppComponent extends WindowComponent implements OnInit, OnDestroy {
  walletEdit = false;
  wallet: Wallet;
  transactions: Transaction[] = [];
  lastTransactionCount = 0;
  currentPage = 0;
  pages = 0;
  itemsPerPage = 3;
  updateIntervalHandle: any;
  walletFirstStartup: boolean;
  state; string;

  constructor(private walletAppService: WalletAppService) {
    super();
    walletAppService.updateWallet().then(loaded => {
      this.walletFirstStartup = !loaded;
      this.state = 'fistWalletAppStartup';
    });

    this.wallet = walletAppService.wallet;

    walletAppService.update.subscribe(wallet => {
      this.wallet = wallet;
      if (wallet) {
        this.pages = Math.ceil(this.wallet.transactions / this.itemsPerPage);
        if (this.pages === 0) {
          this.currentPage = 0;
          this.transactions = [];
        } else {
          if (this.currentPage === 0 || this.currentPage > this.pages) {
            this.currentPage = 1;
          }
          if (this.wallet.transactions !== this.lastTransactionCount) {
            this.walletAppService.getTransactions((this.currentPage - 1) * (this.itemsPerPage), this.itemsPerPage)
              .subscribe((data) => this.transactions = data);
            this.lastTransactionCount = this.wallet.transactions;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.updateIntervalHandle = setInterval(() => this.walletAppService.updateWallet(), 1000 * 15);
  }

  ngOnDestroy() {
    clearInterval(this.updateIntervalHandle);
  }

  nextPage() {
    if (this.currentPage < this.pages) {
      this.currentPage++;
      this.walletAppService.getTransactions((this.currentPage - 1) * (this.itemsPerPage), this.itemsPerPage)
        .subscribe((data) => this.transactions = data);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.walletAppService.getTransactions((this.currentPage - 1) * (this.itemsPerPage), this.itemsPerPage)
        .subscribe((data) => this.transactions = data);
    }
  }
}

export class WalletAppWindowDelegate extends WindowDelegate {
  title = 'Wallet';
  icon = 'assets/desktop/img/wallet_app.svg';
  type: Type<any> = WalletAppComponent;

  constraints = new WindowConstraints({ minWidth: 485, minHeight: 325 });
}
