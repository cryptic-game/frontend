import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ControlCenterSettingsPageComponent} from './control-center-settings-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {webSocketMock} from '../../test-utils';
import {RouterTestingModule} from '@angular/router/testing';
import {RouteReuseStrategy} from '@angular/router';
import {WebSocketSubject} from "rxjs/webSocket";

describe('ControlCenterSettingsPageComponent', () => {
  let component: ControlCenterSettingsPageComponent;
  let fixture: ComponentFixture<ControlCenterSettingsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSettingsPageComponent],
      providers: [
        {provide: WebSocketSubject, useValue: webSocketMock()},
        {provide: RouteReuseStrategy, useValue: {}}
      ],
      imports: [ReactiveFormsModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
