import {TestBed, inject} from '@angular/core/testing';

import {DesktopGuard} from './desktop.guard';

describe('DesktopGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesktopGuard]
    });
  });

  it('should ...', inject([DesktopGuard], (guard: DesktopGuard) => {
    expect(guard).toBeTruthy();
  }));
});
