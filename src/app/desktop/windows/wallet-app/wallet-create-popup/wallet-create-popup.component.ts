import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { WalletAppService } from '../wallet-app.service';
import { FileService } from '../../../../api/files/file.service';
import { WebsocketService } from '../../../../websocket.service';
import { Path } from '../../../../api/files/path';

@Component({
  selector: 'app-wallet-create-popup',
  templateUrl: './wallet-create-popup.component.html',
  styleUrls: ['./wallet-create-popup.component.scss']
})
export class WalletCreatePopupComponent implements OnInit {
  @Output()
  performClose: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  ok: EventEmitter<void> = new EventEmitter<void>();
  @Input() activeDevice;
  working_dir: string = Path.ROOT;

  error = 'No Error';
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

  createWallet() {
    let path: Path = Path.fromString('/wallet');
    let destUUID = path.parentUUID;
    console.log('CREATEING WALLET...');
    this.fileService.getFromPath(this.activeDevice['uuid'], new Path(path.path.slice(-1), destUUID)).subscribe(() => {
      this.error = 'That file already exists';
    }, error => {
      if (error.message === 'file_not_found') {
        this.websocket.ms('currency', ['create'], {}).subscribe(wallet => {
          const credentials = wallet.source_uuid + ' ' + wallet.key;

          this.fileService.createFile(this.activeDevice['uuid'], path.path[path.path.length - 1], credentials, this.working_dir)
            .subscribe({
              error: err => {
                this.error = 'That file couldn\'t be created. Please note your wallet credentials ' +
                  'and put them in a new file with \'touch\' or contact the support: \'' + credentials + '\'';
              }
            });
        }, error1 => {
          if (error1.message === 'already_own_a_wallet') {
            this.error = 'You already own a wallet';
          } else {
            this.error = error1.message;
          }
        });
      } else {
        console.log(error);
      }
    });
    this.walletAppService.loadNewWallet('', '');
  }

}
