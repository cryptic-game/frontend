import { Injectable } from '@angular/core';
import { Wallet } from './wallet';
import { WebsocketService } from '../../../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class WalletAppService {

  public wallet: Wallet;

  constructor(
    private websocketService: WebsocketService
  ) {
    this.updateWallet();
  }

  public async updateWallet(): Promise<boolean> {
    return this.loadNewWallet(localStorage.getItem('wallet_uuid'), localStorage.getItem('wallet_key'));
  }

  public async loadNewWallet(uuid: string, key: string): Promise<boolean> {
    const wallet: any = await this.loadWallet(uuid, key);
    if (wallet) {
      this.setWallet(wallet);
      return true;
    } else {
      return false;
    }
  }

  public checkWalletUuidFormat(uuid: string): boolean {
    return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(uuid);
  }

  public checkWalletKeyFormat(key: string): boolean {
    return /^[0-9a-f]{10}$/.test(key);
  }

  private async loadWallet(uuid: string, key: string): Promise<any> {
    if (this.checkWalletUuidFormat(uuid) && this.checkWalletKeyFormat(key)) {
      const data = await this.websocketService.ms('currency', ['get'], { source_uuid: uuid, key: key }).toPromise();
      console.log(data);
      if ('error' in data) {
        return null;
      } else {
        return data;
      }
    } else {
      return null;
    }
  }

  private setWallet(wallet: Wallet) {
    this.wallet = wallet;
    localStorage.setItem('wallet_uuid', wallet.source_uuid);
    localStorage.setItem('wallet_key', wallet.key);
  }
}
