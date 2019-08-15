import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalCursorService {
  private currentLock: number;

  constructor() {
  }

  /**
   * Sets a global cursor if there is not another one currently set
   * @param cursor The requested cursor type
   * @param lock If this parameter is specified and valid, the current cursor will be overwritten
   * @returns A number which can be used to release the cursor again or -1 if the cursor is locked
   */
  requestCursor(cursor: string, lock?: number): number {
    if (this.currentLock === undefined || this.currentLock === lock) {
      if (document.body.style.cursor !== cursor) {
        document.body.style.setProperty('cursor', cursor, 'important');
      }
      this.currentLock = Math.floor(Math.random() * 10 ** 10);
      return this.currentLock;
    }

    return -1;
  }

  /**
   * Releases a cursor set by {@link GlobalCursorService.requestCursor}
   * @param lock The lock returned from {@link GlobalCursorService.requestCursor}
   * @returns `true` if the lock was correct or `false` if the lock is not valid
   */
  releaseCursor(lock) {
    if (this.currentLock === lock) {
      if (document.body.style.cursor !== '') {
        document.body.style.cursor = '';
      }
      this.currentLock = undefined;
      return true;
    }

    return false;
  }

}
