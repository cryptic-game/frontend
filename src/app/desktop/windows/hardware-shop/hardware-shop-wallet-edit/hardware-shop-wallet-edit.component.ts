import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hardware-shop-wallet-edit',
  templateUrl: './hardware-shop-wallet-edit.component.html',
  styleUrls: ['./hardware-shop-wallet-edit.component.scss']
})
export class HardwareShopWalletEditComponent implements OnInit {

  @Output()
  protected closeEvent: EventEmitter<any> = new EventEmitter<any>();

  protected form: FormGroup;
  protected valid: boolean;

  protected uuidHint: string;
  protected keyHint: string;

  constructor(
    private formBuilder: FormBuilder,
    private hardwareShopService: HardwareShopService
  ) {
    this.valid = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      walletUuid: this.hardwareShopService.getWalletUuid(),
      walletKey: this.hardwareShopService.getWalletKey()
    });

    this.validate(this.form.value.walletUuid, this.form.value.walletKey);
    this.form.valueChanges.subscribe(data => this.validate(data.walletUuid, data.walletKey));
  }

  private validate(walletUuid: string, walletKey: string): void {
    if (this.hardwareShopService.checkWalletUuid(walletUuid)) {
      this.uuidHint = '';
    } else {
      this.uuidHint = 'Please enter a valid Uuid.';
    }

    if (this.hardwareShopService.checkWalletKey(walletKey)) {
      this.keyHint = '';
    } else {
      this.keyHint = 'Please enter a valid Key.';
    }

    this.valid = !this.uuidHint && !this.keyHint;
  }

  protected save(): void {
    const uuid = this.form.get('walletUuid').value;
    const key = this.form.get('walletKey').value;

    if (this.hardwareShopService.checkWalletUuid(uuid) && this.hardwareShopService.checkWalletKey(key)) {
      this.hardwareShopService.setWalletUuid(uuid);
      this.hardwareShopService.setWalletKey(key);

      this.closeEvent.emit();
    }
  }

  protected close(): void {
    this.closeEvent.emit();
  }
}
