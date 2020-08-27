import { Injectable } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private readonly websocketService: WebsocketService
  ) {
  }

  /**
   * Returns the value of a setting. And throws an
   * error in the Observable if the setting does not exist.
   *
   * @param key the name of a setting
   * @return an Observable with the {key: string, value: string} of the setting
   */
  public get(key: string): Observable<{ key: string, value: string }> {
    return this.websocketService.request({ action: 'setting', key });
  }

  /**
   * Saves a setting (key - value store)
   * error in the Observable if the value is to long.
   *
   * @param key the key of the setting
   * @param value the value of the setting
   */
  public save(key: string, value: string): Observable<{ key: string, value: string }> {
    return this.websocketService.request({ action: 'setting', key, value });
  }

  /**
   * Deletes a setting. And throws an error in
   * the Observable if the setting does not exist.
   *
   * @param key the name of a setting
   */
  public _delete(key: string): Observable<{ success: boolean }> {
    return this.websocketService.request({ action: 'setting', key, delete: '' });
  }
}
