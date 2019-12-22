import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-wallet-app-transaction',
  templateUrl: './wallet-app-transaction.component.html',
  styleUrls: ['./wallet-app-transaction.component.scss']
})
export class WalletAppTransactionComponent implements OnInit {

  @Input()
  transaction: Transaction;

  constructor() { }

  ngOnInit() {
    if (this.transaction.destination_uuid == "00000000-0000-0000-0000-000000000000") {
      this.transaction.destination_uuid = "Bank";
    }
  }

}
