import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalComponent } from './terminal.component';
import { HttpClientModule } from '@angular/common/http';
import { emptyWindowDelegate, webSocketMock, windowManagerMock } from '../../../test-utils';
import { WindowManager } from '../../window-manager/window-manager';
import { WebsocketService } from '../../../websocket.service';

describe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalComponent],
      providers: [
        { provide: WindowManager, useValue: windowManagerMock() },
        { provide: WebsocketService, useValue: webSocketMock() }
      ],
      imports: [HttpClientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
    component.delegate = emptyWindowDelegate();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
