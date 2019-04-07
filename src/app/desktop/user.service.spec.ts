import { inject, TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [UserService]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
