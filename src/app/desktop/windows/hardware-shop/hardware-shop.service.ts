import { Injectable } from '@angular/core';
import { WebsocketService } from '../../../websocket.service';
import { HardwarePart } from './hardware-shop.component';

@Injectable({
  providedIn: 'root'
})
export class HardwareShopService {

  private localStorage: Storage;

  constructor(private websocketService: WebsocketService) {
    this.localStorage = window.localStorage;
  }

  public setWalletUuid(uuid: string): void {
    this.localStorage.setItem('wallet_uuid', uuid);
  }

  public setWalletKey(key: string): void {
    this.localStorage.setItem('wallet_key', key);
  }

  public checkWalletUuid(uuid: string): boolean {
    return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(uuid);
  }

  public checkWalletKey(key: string): boolean {
    return /^[0-9a-f]{10}$/.test(key);
  }

  public getWalletUuid(): string {
    return this.localStorage.getItem('wallet_uuid');
  }

  public getWalletKey(): string {
    return this.localStorage.getItem('wallet_key');
  }

  public getCartItems(): HardwarePart[] {
    const items = JSON.parse(this.localStorage.getItem('cart'));
    return items === null ? [] : items;
  }

  public setCartItems(items: HardwarePart[]): void {
    this.localStorage.setItem('cart', JSON.stringify(items));
  }

  public getMorphCoins(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.websocketService.ms('currency', ['get'], { source_uuid: this.getWalletUuid(), key: this.getWalletKey() })
        .subscribe(data => {
            if ('error' in data) {
              reject(data.error);
            } else {
              resolve(data.amount);
            }
          }
        );
    });
  }

  public getHardwareParts(): Promise<HardwarePart[]> {
    return new Promise<HardwarePart[]>((resolve, reject) => {
      this.websocketService.ms('inventory', ['shop', 'list'], {})
        .subscribe(data => {
          if ('error' in data) {
            reject(data.error);
          } else {
            resolve(data.products);
          }
        });
    });
  }
}
