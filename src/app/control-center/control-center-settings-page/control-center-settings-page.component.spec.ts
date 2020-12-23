import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterSettingsPageComponent } from './control-center-settings-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { webSocketMock } from '../../test-utils';
import { RouterTestingModule } from '@angular/router/testing';
import { RouteReuseStrategy } from '@angular/router';

describe('ControlCenterSettingsPageComponent', () => {
  let component: ControlCenterSettingsPageComponent;
  let fixture: ComponentFixture<ControlCenterSettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSettingsPageComponent],
      providers: [
        { provide: WebSocketSubject, useValue: webSocketMock() },
        { provide: RouteReuseStrategy, useValue: {} }
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
