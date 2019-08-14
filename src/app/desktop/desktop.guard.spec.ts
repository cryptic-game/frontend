import { inject, TestBed } from '@angular/core/testing';

import { DesktopGuard } from './desktop.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DesktopGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [DesktopGuard]
    });
  });

  it('should ...', inject([DesktopGuard], (guard: DesktopGuard) => {
    expect(guard).toBeTruthy();
  }));
});
