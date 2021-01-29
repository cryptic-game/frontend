import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-wallet-create-popup',
  templateUrl: './wallet-create-popup.component.html',
  styleUrls: ['./wallet-create-popup.component.scss']
})
export class WalletCreatePopupComponent implements OnInit {
  @Output()
  performClose: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

}
