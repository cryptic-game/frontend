import { Injectable } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private websocketService: WebsocketService) {
  }

  /**
   * Returns the value of a setting.
   *
   * Throws an error in the Observable if the setting does not exist.
   *
   * @param key the name of a setting
   * @return an Observable with the value of the setting
   */
  public get(key: string): Observable<string> {
    // requestMany and key check because non-ms requests don't have tags yet
    return this.websocketService.requestMany({ action: 'setting', key }).pipe(
      first(setting => setting.key === key && typeof setting.value === 'string'),
      map(setting => setting.value)
    );
  }

  /**
   * Saves a setting (key - value store)
   *
   * Throws an error in the Observable if the value is too long.
   *
   * @param key the key of the setting
   * @param value the value of the setting
   */
  public set(key: string, value: string): Observable<{ key: string, value: string }> {
    return this.websocketService.request({ action: 'setting', key, value });
  }

  /**
   * Deletes a setting.
   *
   * Throws an error in the Observable if the setting does not exist.
   *
   * @param key the name of a setting
   */
  public delete(key: string): Observable<{ success: boolean }> {
    return this.websocketService.request({ action: 'setting', key, delete: '' });
  }
}
