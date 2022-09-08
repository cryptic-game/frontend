import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Changelog } from './control-center/control-center-changelog-page/Changelog';
import { setTag } from '@sentry/angular';

@Component({
  selector: 'app-root',
  animations: [
    trigger('routerSlide', [
      transition('control-center => desktop', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [style({ left: '100%', 'z-index': -1 })]),
        query(':leave', animateChild()),
        group([
          query(':leave', [animate('500ms ease-in-out', style({ left: '-100%' }))]),
          query(':enter', [animate('500ms ease-in-out', style({ left: '0%' }))]),
        ]),
        query(':enter', animateChild()),
      ]),
      transition('desktop => control-center', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [style({ left: '-100%' })]),
        query(':leave', [style({ 'z-index': -1 }), animateChild()]),
        group([
          query(':leave', [animate('500ms ease-in-out', style({ left: '100%' }))]),
          query(':enter', [animate('500ms ease-in-out', style({ left: '0%' }))]),
        ]),
        query(':enter', animateChild()),
      ]),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public latestVersion?: string;

  constructor(
    private websocket: WebsocketService,
    private readonly http: HttpClient,
    @Inject(LOCALE_ID) locale: string
  ) {
    setTag('locale', locale);
    websocket.init().then();
  }

  ngOnInit() {
    this.http
      .get<Changelog>('/assets/changelog.json')
      .subscribe((changelog) => (this.latestVersion = changelog.latest));
  }

  ngOnDestroy() {
    this.websocket.close();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  activateUpdate() {
    // this.versionService.updateAndReload();
  }

  cancelUpdate() {
    // this.versionService.cancelUpdate();
  }
}
