import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerminalComponent } from './terminal.component';
import { HttpClientModule } from '@angular/common/http';
import { emptyWindowDelegate, webSocketMock, windowManagerMock } from '../../../test-utils';
import { WindowManager } from '../../window-manager/window-manager';
import { WebsocketService } from '../../../websocket.service';

describe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalComponent],
      providers: [
        { provide: WindowManager, useValue: windowManagerMock() },
        { provide: WebsocketService, useValue: webSocketMock() },
      ],
      imports: [HttpClientModule],
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
    component.execute('help help');
    component.execute('chaozz');
    component.execute('history'); //Hidden-flag
    component.execute('');
    expect(component.getHistory().length).toBe(4);
    // History is printed in reverse
    expect(component.getHistory()).toEqual(['chaozz', 'help help', 'help', 'test']);
  });

  it('should clear the protocol with clearHistory', () => {
    component.execute('test');
    component.execute('help');
    component.execute('help');
    component.execute('history clear');
    expect(component.getHistory().length).toBe(0);
  });
});
