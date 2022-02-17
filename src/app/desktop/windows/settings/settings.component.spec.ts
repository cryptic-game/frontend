import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {ReactiveFormsModule} from '@angular/forms';
import {WebsocketService} from '../../../websocket.service';
import {webSocketMock} from '../../../test-utils';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        {provide: WebsocketService, useValue: webSocketMock()}
      ],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
