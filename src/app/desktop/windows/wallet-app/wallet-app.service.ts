import { EventEmitter, Injectable } from '@angular/core';
import { Wallet } from './wallet';
import { WebsocketService } from '../../../websocket.service';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { Transaction } from './transaction';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SettingService } from '../../../api/setting/setting.service';

@Injectable({
  providedIn: 'root'
})
export class WalletAppService {

  public wallet: Wallet;
  public readonly update: EventEmitter<Wallet> = new EventEmitter<Wallet>();

  constructor(
    private websocketService: WebsocketService,
    private settingService: SettingService
  ) {
    this.updateWallet();
  }

  public async updateWallet(): Promise<boolean> {
    try {
      const credentials = await this.getWalletIdentifier();
      return await this.loadNewWallet(credentials.id, credentials.key);
    } catch (e) {
      return false;
    }
  }

  public getWalletIdentifier(): Promise<{ id: string, key: string }> {
    let id: string;

    return this.settingService.get('wallet_id')
      .pipe(
        tap(console.log),
        switchMap(data => {
          id = data.value;
          return this.settingService.get('wallet_key');
        }),
        tap(console.log),
        map(data => ({ id, key: data.value })),
        tap(console.log)
      ).toPromise();
  }

  public async loadNewWallet(uuid: string, key: string): Promise<boolean> {
    const wallet: any = await this.loadWallet(uuid, key);
    if (wallet) {
      this.setWallet(wallet);
      this.update.emit(wallet);
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

  public getTransactions(offset: number, count: number): Observable<Transaction[]> {
    return this.websocketService.ms('currency', ['transactions'],
      { source_uuid: this.wallet.source_uuid, key: this.wallet.key, offset, count })
      .pipe(map(data => data.transactions));
  }

  private setWallet(wallet: Wallet): void {
    this.wallet = wallet;
    forkJoin({
      id: this.settingService.save('wallet_id', wallet.source_uuid),
      key: this.settingService.save('wallet_key', wallet.key)
    }).subscribe();
  }

  private loadWallet(uuid: string, key: string): Promise<any> {
    if (!this.checkWalletUuidFormat(uuid) || !this.checkWalletKeyFormat(key)) {
      return Promise.resolve(null);
    }
    return this.websocketService
      .msPromise('currency', ['get'], { source_uuid: uuid, key: key })
      .catch(() => null);
  }
}
