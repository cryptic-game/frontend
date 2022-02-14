import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HardwareShopItemComponent} from './hardware-shop-item.component';
import {WebsocketService} from '../../../../websocket.service';
import {webSocketMock} from '../../../../test-utils';
import {PartCategory} from '../../../../api/hardware/hardware-parts';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('HardwareShopItemComponent', () => {
  let component: HardwareShopItemComponent;
  let fixture: ComponentFixture<HardwareShopItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: WebsocketService, useValue: webSocketMock()}],
      declarations: [HardwareShopItemComponent],
      imports: [NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopItemComponent);
    component = fixture.componentInstance;
    const testPart = {name: '', id: 0, category: PartCategory.CASE, size: 'small'};
    component.item = {
      name: '',
      price: 0,
      part: testPart
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
