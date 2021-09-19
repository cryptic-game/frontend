import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WalletAppService } from '../wallet-app.service';

@Component({
  selector: 'app-wallet-app-edit',
  templateUrl: './wallet-app-edit.component.html',
  styleUrls: ['./wallet-app-edit.component.scss']
})
export class WalletAppEditComponent implements OnInit {

  form = new FormGroup({
    uuid: new FormControl('', [
      Validators.required,
      Validators.pattern(WalletAppService.WALLET_UUID_REGEX)
    ]),
    key: new FormControl('', [
      Validators.required,
      Validators.pattern(WalletAppService.WALLET_KEY_REGEX)
    ])
  });

  error = false;

  @Output()
  private performClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(private walletAppService: WalletAppService) {
  }

  ngOnInit() {
    if (this.walletAppService.wallet) {
      this.form.setValue({
        uuid: this.walletAppService.wallet.source_uuid,
        key: this.walletAppService.wallet.key
      });
    }
  }

  save(): void {
    if (this.form.valid) {
      this.walletAppService.loadWallet(this.form.value.uuid, this.form.value.key).then(success => {
        this.error = !success;
        if (success) {
          this.performClose.emit();
        } else {
          setTimeout(() => this.error = false, 5 * 1000);
        }
      });
    }
  }

}
