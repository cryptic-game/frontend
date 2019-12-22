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
  }

}
