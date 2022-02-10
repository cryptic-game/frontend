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

  it('should add commands to the protocol', () => {
    component.execute('test');
    component.execute('help');
    component.execute('help');
    expect(component.getHistory().length).toBe(2);
    // History is printed in reverse
    expect(component.getHistory()).toEqual(['help', 'help']);
  });

  it('should clear the protocol with clearHistory', () => {
    component.execute('test');
    component.execute('help');
    component.execute('help');
    component.execute('clearHistory');
    expect(component.getHistory().length).toBe(0);
  });
});
