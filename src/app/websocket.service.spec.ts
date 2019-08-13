import { inject, TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebsocketService]
    });
  });

  it('should be created', inject([WebsocketService], (service: WebsocketService) => {
    expect(service).toBeTruthy();
  }));
});
