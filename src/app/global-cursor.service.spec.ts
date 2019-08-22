import { inject, TestBed } from '@angular/core/testing';

import { GlobalCursorService } from './global-cursor.service';

describe('GlobalCursorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalCursorService]
    });
  });

  afterEach(() => {
    document.body.style.cursor = '';
  });

  it('should be created', inject([GlobalCursorService], (service: GlobalCursorService) => {
    expect(service).toBeTruthy();
  }));

  it('#requestCursor() should set the cursor of the document body and return a number if the current lock is undefined',
    inject([GlobalCursorService], (service: GlobalCursorService) => {
      service['currentLock'] = undefined;
      document.body.style.cursor = '';
      const testCursor = 'pointer';

      expect(typeof service.requestCursor(testCursor)).toEqual('number');
      expect(document.body.style.cursor).toEqual(testCursor);
    }));

  it('#requestCursor() should return -1 and should not set the cursor if the current lock is defined',
    inject([GlobalCursorService], (service: GlobalCursorService) => {
      service['currentLock'] = 1;
      document.body.style.cursor = '';

      expect(service.requestCursor('pointer')).toEqual(-1);
      expect(document.body.style.cursor).toEqual('');
    }));

  it('#requestCursor() should overwrite the current cursor if the lock parameter is valid',
    inject([GlobalCursorService], (service: GlobalCursorService) => {
      const lock = service.requestCursor('pointer');
      const testCursor = 'progress';
      service.requestCursor(testCursor, lock);

      expect(document.body.style.cursor).toEqual(testCursor);
    }));

  it('#releaseCursor() should reset the cursor of the document body, reset the lock and return true if the lock is valid',
    inject([GlobalCursorService], (service: GlobalCursorService) => {
      const lock = 15;
      service['currentLock'] = lock;
      document.body.style.cursor = 'pointer';

      expect(service.releaseCursor(lock)).toBeTruthy();
      expect(document.body.style.cursor).toEqual('');
      expect(service['currentLock']).toBeUndefined();
    }));

  it('#releaseCursor() should not the cursor of the document body and return false if the lock is not valid',
    inject([GlobalCursorService], (service: GlobalCursorService) => {
      service['currentLock'] = 105;
      const testCursor = 'pointer';
      document.body.style.cursor = testCursor;

      expect(service.releaseCursor(0)).toBeFalsy();
      expect(document.body.style.cursor).toEqual(testCursor);
    }));

});
