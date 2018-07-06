import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  /**
   * @param CookieName Cookie name
   * @returns {boolean}
   */
  static hasCookie( CookieName: string ): boolean {
    return this.getCookie(CookieName) !== '';
  }
  /**
   * @param CookieName Cookie name
   * @returns {string}
   */
  static getCookie( CookieName: string ): string {
    const name = CookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }
  /**
   * @param CookieName   Cookie name
   * @param CookieValue  Cookie value
   * @param ExpireDays   Number of days until the cookies expires
   */
  static setCookie(
    CookieName: string,
    CookieValue: string,
    ExpireDays: number
  ): void {
    const d: Date = new Date();
    d.setTime(d.getTime() + (ExpireDays * 24 * 60 * 60 * 1000));
    const expires: string = 'expires=' + d.toUTCString();
    document.cookie = CookieName + '=' + CookieValue + ';' + expires + ';path=/';
  }
}
