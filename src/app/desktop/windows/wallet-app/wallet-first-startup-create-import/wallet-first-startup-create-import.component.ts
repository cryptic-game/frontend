import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-wallet-first-startup-create-import',
  templateUrl: './wallet-first-startup-create-import.component.html',
  styleUrls: ['./wallet-first-startup-create-import.component.scss']
})
export class WalletFirstStartupCreateImportComponent implements OnInit {
  @Output()
  create: EventEmitter<void> = new EventEmitter<void>();
  import: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

}
