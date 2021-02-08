import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { WalletAppService } from '../wallet-app.service';
import { FileService } from '../../../../api/files/file.service';
import { WebsocketService } from '../../../../websocket.service';
import { Path } from '../../../../api/files/path';
import { of } from 'rxjs';

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
  @Input() deviceUUID;
  working_dir: string = Path.ROOT;
  folder_path = '/';
  file_name = 'wallet';

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

  createWallet() {
    console.log(this.deviceUUID);
    let path: Path = Path.fromString(this.folder_path + this.file_name);
    console.log('CREATEING WALLET...');
    console.log(path);

    this.fileService.getFromPath(this.deviceUUID, path).subscribe((file) => {
      this.error = 'File already exists';
    }, error => {
      if (error.message === 'file_not_found') {
        console.log('File does not exists ;)');
        this.fileService.getFromPath(this.deviceUUID, Path.fromString(this.folder_path)).subscribe((folder_path_file) => {
          let folder_uuid = folder_path_file.uuid;
          this.websocket.ms('currency', ['create'], {}).subscribe(wallet => {
            const credentials = wallet.source_uuid + ' ' + wallet.key;
            this.fileService.createFile(this.deviceUUID, this.file_name, credentials, folder_uuid).subscribe((wallet_file) => {
              this.error = '';
              this.ok.emit();
            }, (file_create_error) => {
              if (file_create_error.message === 'invalid_input_data') {
                this.error = 'Filename/Path is not valid.';
                this.websocket.ms('currency', ['reset'], {source_uuid: wallet.source_uuid}).subscribe((reset_wallet) => {
                }, (error_reset_wallet) => {
                  console.error(error_reset_wallet);
                });
              } else {
                console.error(file_create_error);
              }
            });
          }, (wallet_error) => {
            if (wallet_error.message === 'already_own_a_wallet') {
              this.error = 'You already own a Wallet. Please import this.';
            } else {
              console.error(wallet_error);
            }
          });
        }, folder_path_error => {
          this.error = 'Path does not exists';
        });

      } else {
        console.error(error);
      }
    });


    //this.walletAppService.loadNewWallet('', '');
  }

}
