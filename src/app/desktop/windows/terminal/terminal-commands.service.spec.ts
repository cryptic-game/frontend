import {inject, TestBed} from '@angular/core/testing';

import {TerminalCommandsService} from './terminal-commands.service';
import {HttpClientModule} from '@angular/common/http';

describe('TerminalCommandsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalCommandsService],
      imports: [HttpClientModule]
    });
  });

  it('should be created', inject([TerminalCommandsService], (service: TerminalCommandsService) => {
    expect(service).toBeTruthy();
  }));
});
