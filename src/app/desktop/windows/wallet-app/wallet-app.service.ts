import { EventEmitter, Injectable } from '@angular/core';
import { Wallet } from './wallet';
import { WebsocketService } from '../../../websocket.service';
import { forkJoin } from 'rxjs';
import { Transaction } from './transaction';
import { SettingService } from '../../../api/setting/setting.service';

@Injectable({
  providedIn: 'root'
})
export class WalletAppService {

  static WALLET_UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/;
  static WALLET_KEY_REGEX = /^[0-9a-f]{10}$/;

  wallet: Wallet;
  readonly update: EventEmitter<Wallet | null> = new EventEmitter<Wallet | null>();

  private updateIntervalHandle: any = null;

  constructor(private websocketService: WebsocketService,
              private settingService: SettingService) {
    this.initUpdates();
  }

  private initUpdates(): void {
    this.updateIntervalHandle = setInterval(() => {
      if (this.update.observers.length > 0) {
        this.updateWallet().then();
      }
    }, 1000 * 15);
  }

  async updateWallet(): Promise<boolean> {
    try {
      const { id, key } = await this.getCredentials();
      return await this.loadWallet(id, key);
    } catch (e) {
      if (e.message === 'unknown setting') {
        this.wallet = null;
        this.update.emit(null);
      } else {
        console.warn(e);
      }
      return false;
    }
  }

  async loadWallet(uuid: string, key: string): Promise<boolean> {
    const wallet: any = await this.getWallet(uuid, key);

    // Save credentials only if wallet is valid and they are different than the saved ones
    if (wallet && (!this.wallet || this.wallet.source_uuid !== wallet.uuid || this.wallet.key !== wallet.key)) {
      this.saveCredentials(wallet);
    }

    // Only update wallet if it is valid or not valid anymore
    // (don't update when the user enters wrong credentials, but do update if wallet gets deleted)
    if (wallet || (this.wallet && uuid === this.wallet.source_uuid && key === this.wallet.key)) {
      this.wallet = wallet;
      this.update.emit(wallet);
    }

    return !!wallet;
  }

  async getTransactions(offset: number, count: number): Promise<Transaction[]> {
    const response = await this.websocketService.msPromise('currency', ['transactions'],
      { source_uuid: this.wallet.source_uuid, key: this.wallet.key, offset, count });
    return response.transactions;
  }

  private async getWallet(uuid: string, key: string): Promise<any> {
    if (!WalletAppService.WALLET_UUID_REGEX.test(uuid) || !WalletAppService.WALLET_KEY_REGEX.test(key)) {
      return null;
    }

    try {
      return await this.websocketService
        .msPromise('currency', ['get'], { source_uuid: uuid, key: key });
    } catch (e) {
      return null;
    }
  }

  private getCredentials(): Promise<{ id: string, key: string }> {
    return forkJoin({
      id: this.settingService.get('wallet_id'),
      key: this.settingService.get('wallet_key')
    }).toPromise();
  }

  private saveCredentials(wallet: Wallet): void {
    forkJoin({
      id: this.settingService.set('wallet_id', wallet.source_uuid),
      key: this.settingService.set('wallet_key', wallet.key)
    }).subscribe();
  }
}
