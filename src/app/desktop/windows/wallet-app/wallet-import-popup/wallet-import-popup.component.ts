import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { WalletAppService } from '../wallet-app.service';
import { FileService } from '../../../../api/files/file.service';
import { WebsocketService } from '../../../../websocket.service';
import { Path } from '../../../../api/files/path';
import { of } from 'rxjs';

@Component({
  selector: 'app-wallet-import-popup',
  templateUrl: './wallet-import-popup.component.html',
  styleUrls: ['./wallet-import-popup.component.scss']
})
export class WalletImportPopupComponent implements OnInit {
  @Output()
  performClose: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  ok: EventEmitter<void> = new EventEmitter<void>();
  @Input() deviceUUID;
  working_dir: string = Path.ROOT;
  name = '----';
  wallet_id = '----';
  wallet_key = '----';

  error = '';
  constructor(private walletAppService: WalletAppService, private fileService: FileService,
              protected websocket: WebsocketService) {
   }

  ngOnInit(): void {
  }

  modalClickHandler(e) {
    if (e.toElement.classList[0] === 'modal') {
      this.performClose.emit();
    }
  }

  importWallet() {

  }
}
