import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MinerComponent } from './miner.component';
import { WebsocketService } from '../../../websocket.service';
import { webSocketMock } from '../../../test-utils';
import { DesktopDeviceService } from '../../desktop-device.service';

describe('MinerComponent', () => {
  let component: MinerComponent;
  let fixture: ComponentFixture<MinerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        DesktopDeviceService,
        { provide: WebsocketService, useValue: webSocketMock() }
      ],
      declarations: [MinerComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
