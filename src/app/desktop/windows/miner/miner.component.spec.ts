import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ReactiveFormsModule} from '@angular/forms';
import {MinerComponent} from './miner.component';
import {WebsocketService} from '../../../websocket.service';
import {emptyWindowDelegate, webSocketMock} from '../../../test-utils';

describe('MinerComponent', () => {
  let component: MinerComponent;
  let fixture: ComponentFixture<MinerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: WebsocketService, useValue: webSocketMock()}
      ],
      declarations: [MinerComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinerComponent);
    component = fixture.componentInstance;
    component.delegate = emptyWindowDelegate();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
