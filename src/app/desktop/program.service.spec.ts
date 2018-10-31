import { TestBed, inject } from '@angular/core/testing';

import { ProgramService } from './program.service';
import { HttpClientModule } from '@angular/common/http';

describe('ProgramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ProgramService]
    });
  });

  it('should be created', inject(
    [ProgramService],
    (service: ProgramService) => {
      expect(service).toBeTruthy();
    }
  ));
});
