import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WalletAppService } from '../wallet-app.service';

@Component({
  selector: 'app-wallet-app-edit',
  templateUrl: './wallet-app-edit.component.html',
  styleUrls: ['./wallet-app-edit.component.scss']
})
export class WalletAppEditComponent {

  form = new FormGroup({
    uuid: new FormControl(),
    key: new FormControl()
  });
  correctUuid: boolean;
  correctKey: boolean;
  error: boolean;
  @Output()
  private close: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private walletAppService: WalletAppService
  ) {
    this.correctUuid = false;
    this.correctKey = false;
    this.error = false;
    this.form.valueChanges.subscribe(data => {
      this.correctUuid = walletAppService.checkWalletUuidFormat(data.uuid);
      this.correctKey = walletAppService.checkWalletKeyFormat(data.key);
    });
  }

  save(): void {
    if (this.correctUuid && this.correctKey) {
      this.walletAppService.loadNewWallet(this.form.get('uuid').value, this.form.get('key').value)
        .subscribe(data => {
          this.error = !data;
          if (!data) {
            setTimeout(() => this.error = false, 5 * 1000);
          } else {
            this.close.emit();
          }
        });
    }
  }
}
