import {TestBed, inject} from '@angular/core/testing';

import {SignUpService} from './sign-up.service';
import {HttpClientModule} from '@angular/common/http';

describe('SignUpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SignUpService]
    });
  });

  it('should be created', inject([SignUpService], (service: SignUpService) => {
    expect(service).toBeTruthy();
  }));
});
