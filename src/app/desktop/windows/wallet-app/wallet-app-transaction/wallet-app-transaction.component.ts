import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { WalletAppService } from '../wallet-app.service';

@Component({
  selector: 'app-wallet-app-transaction',
  templateUrl: './wallet-app-transaction.component.html',
  styleUrls: ['./wallet-app-transaction.component.scss']
})
export class WalletAppTransactionComponent implements OnInit {

  @Input()
  transaction: Transaction;

  moneyToCurrent: boolean;
  time: string;

  constructor(
    private walletAppService: WalletAppService
  ) {
  }

  ngOnInit() {
    if (this.transaction.destination_uuid === '00000000-0000-0000-0000-000000000000') {
      this.transaction.destination_uuid = 'Hardware Shop';
    }

    this.moneyToCurrent = this.transaction.destination_uuid === this.walletAppService.wallet!.source_uuid;
    this.time = new Date(new Date(this.transaction.time_stamp).getTime() - new Date().getTimezoneOffset() * 60000).toLocaleString();
  }
}
