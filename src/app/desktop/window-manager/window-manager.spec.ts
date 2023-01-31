import { WindowManager } from './window-manager';
import { emptyDevice } from '../../test-utils';

describe('WindowManager', () => {
  it('should create an instance', () => {
    expect(new WindowManager(emptyDevice())).toBeTruthy();
  });
});
