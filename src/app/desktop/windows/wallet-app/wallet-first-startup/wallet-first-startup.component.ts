import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-wallet-first-startup',
  templateUrl: './wallet-first-startup.component.html',
  styleUrls: ['./wallet-first-startup.component.scss']
})
export class WalletFirstStartupComponent implements OnInit {
  @Output()
  performClose: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

}
