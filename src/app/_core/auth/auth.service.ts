import { Injectable } from '@angular/core';
import { fromEvent, interval, Observable, of, Subject } from 'rxjs';
import { Provider, Session, Token } from './auth.domain';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly WIDTH = 600;
  private static readonly HEIGHT = 700;

  private token0?: Token;
  private provider0?: Provider;
  private tokenRequesting?: Subject<Token>;

  private get token(): Token | undefined {
    return this.token0 || (this.token0 = AuthService.decode(localStorage.getItem('token')));
  }

  private set token(value: Token | undefined) {
    if (value) {
      localStorage.setItem('token', value.value);
    } else {
      localStorage.removeItem('token');
    }

    this.token0 = value;
  }

  public get provider(): Provider | undefined {
    return this.provider0 || (this.provider0 = JSON.parse(localStorage.getItem('provider')));
  }

  public set provider(value: Provider | undefined) {
    if (value) {
      localStorage.setItem('provider', JSON.stringify(value));
    } else {
      localStorage.removeItem('provider');
    }

    this.provider0 = value;
  }

  constructor(
    private readonly http: HttpClient
  ) {
  }

  private static isExpired(token: Token): boolean {
    const unixEpoche = Date.now() / 1000 + 10; // 10 seconds gap because of network delay, etc.
    return token.expire < unixEpoche;
  }

  private static createPopup(url: string): Window {
    const x = screen.width / 2 - AuthService.WIDTH / 2 + (window.screenLeft || window.screenX || 0);
    const y = screen.height / 2 - AuthService.HEIGHT / 2 + (window.screenTop || window.screenY || 0);

    return open(url, '_blank', `width=${AuthService.WIDTH},height=${AuthService.HEIGHT},left=${x},top=${y}`);
  }

  private static decode(value?: string): Token | null {
    if (!value) {
      return null;
    }

    const { user_id, exp } = jwtDecode<{ user_id: string } & JwtPayload>(value);

    if (!user_id) {
      throw new Error('Missing \'user_id\' field in jwt token.');
    }

    if (!exp) {
      throw new Error('Missing \'exp\' field in jwt token.');
    }

    return { value, userId: user_id, expire: exp };
  }

  public getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${environment.api}/oauth2/list`)
      .pipe(
        tap(provider => {
          if (!this.provider) {
            return;
          }

          const currProvider = provider.find(p => p.id === this.provider.id);
          this.provider = this.provider && !currProvider ? null : currProvider;
        }),
        take(1)
      );
  }

  public getSession(): Observable<Session> {
    return this.getToken()
      .pipe(
        mergeMap(token => this.http.post<{ session: Session }>(`${environment.api}/user/login`, { access_token: token.value })),
        map(({ session }) => session),
        take(1)
      );
  }

  private getToken(): Observable<Token> {
    if (!this.provider) {
      throw new Error('Provider is not defined.');
    }

    if (this.tokenRequesting) {
      return this.tokenRequesting.pipe(take(1));
    }

    if (this.token && !AuthService.isExpired(this.token)) {
      return of(this.token);
    }

    this.tokenRequesting = new Subject();

    return this.requestToken(this.provider)
      .pipe(
        tap(token => {
          this.token = token;
          this.tokenRequesting.next(token);
          this.tokenRequesting = null;
        }),
        take(1)
      );
  }

  private requestToken(provider: Provider): Observable<Token> {
    const popup = AuthService.createPopup(provider.auth_uri);

    return interval(500)
      .pipe(
        filter(_ => {
          try {
            return popup.origin === origin;
          } catch (_) {
            return false;
          }
        }),
        take(1),
        tap(_ => popup.postMessage(environment.api, origin)),
        mergeMap(_ => fromEvent<MessageEvent>(popup, 'message')),
        filter(event => event.origin === origin && event.data !== environment.api),
        tap(_ => popup.close()),
        map(event => AuthService.decode(event.data)), take(1)
      );
  }
}
