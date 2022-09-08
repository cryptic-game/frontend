import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { WalletAppService } from './wallet-app.service';
import { Wallet } from './wallet';
import { Transaction } from './transaction';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet-app',
  templateUrl: './wallet-app.component.html',
  styleUrls: ['./wallet-app.component.scss'],
})
export class WalletAppComponent extends WindowComponent implements OnInit, OnDestroy {
  walletEdit = false;
  wallet: Wallet | null;
  transactions: Transaction[] = [];
  lastTransactionCount = 0;
  currentPage = 0;
  pages = 0;
  itemsPerPage = 3;

  private updateSubscription: Subscription;

  constructor(private walletAppService: WalletAppService) {
    super();

    this.wallet = walletAppService.wallet;

    this.updateSubscription = walletAppService.update.subscribe((wallet) => {
      if (wallet == null) {
        this.walletEdit = true;
        this.currentPage = 0;
        this.pages = 0;
        this.lastTransactionCount = 0;
        this.transactions = [];
      }
      this.wallet = wallet;
      if (wallet) {
        this.pages = Math.ceil(this.wallet!.transactions / this.itemsPerPage);
        if (this.pages === 0) {
          this.currentPage = 0;
          this.lastTransactionCount = 0;
          this.transactions = [];
        } else {
          if (this.currentPage === 0 || this.currentPage > this.pages) {
            this.currentPage = 1;
          }
          if (this.wallet!.transactions !== this.lastTransactionCount) {
            this.loadTransactions().then();
            this.lastTransactionCount = this.wallet!.transactions;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.walletAppService.updateWallet().then();
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  async nextPage() {
    if (this.currentPage < this.pages) {
      this.currentPage++;
      await this.loadTransactions();
    }
  }

  async previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.loadTransactions();
    }
  }

  private async loadTransactions() {
    this.transactions = await this.walletAppService.getTransactions(
      (this.currentPage - 1) * this.itemsPerPage,
      this.itemsPerPage
    );
  }
}

export class WalletAppWindowDelegate extends WindowDelegate {
  title = 'Wallet';
  icon = 'assets/desktop/img/wallet_app.svg';
  type: Type<any> = WalletAppComponent;

  override constraints = new WindowConstraints({ minWidth: 485, minHeight: 325 });
}
