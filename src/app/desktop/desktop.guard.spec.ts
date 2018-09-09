import {TestBed, inject} from '@angular/core/testing';

import {DesktopGuard} from './desktop.guard';
import {RouterTestingModule} from '@angular/router/testing';

describe('DesktopGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [DesktopGuard]
    });
  });

  it('should ...', inject([DesktopGuard], (guard: DesktopGuard) => {
    expect(guard).toBeTruthy();
  }));
});
