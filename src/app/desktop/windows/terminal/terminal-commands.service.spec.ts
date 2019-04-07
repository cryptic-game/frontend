import { inject, TestBed } from '@angular/core/testing';

import { TerminalCommandsService } from './terminal-commands.service';
import { HttpClientModule } from '@angular/common/http';
import { WebsocketService } from '../../../websocket.service';

describe('TerminalCommandsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalCommandsService, WebsocketService],
      imports: [HttpClientModule]
    });
  });

  it('should be created', inject([TerminalCommandsService], (service: TerminalCommandsService) => {
    expect(service).toBeTruthy();
  }));
});
