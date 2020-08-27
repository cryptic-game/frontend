import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
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
  currentPage = 1;
  pages = 1;
  itemsPerPage = 3;

  constructor(
    private readonly walletAppService: WalletAppService
  ) {
    super();
    walletAppService.update.subscribe(loaded => this.setWalletEditStatus(!loaded));

    this.wallet = walletAppService.wallet;

    let loading = true;

    walletAppService.update.subscribe((wallet) => {
      this.wallet = wallet;
      if (wallet) {
        this.setWalletEditStatus(false);
        this.pages = Math.ceil(this.wallet.transactions / this.itemsPerPage);
        if (loading) {
          this.walletAppService.getTransactions(0, this.itemsPerPage)
            .subscribe((data) => this.transactions = data);
        }
        loading = false;
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
