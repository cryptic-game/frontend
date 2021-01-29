import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCreatePopupComponent } from './wallet-create-popup.component';

describe('WalletCreatePopupComponent', () => {
  let component: WalletCreatePopupComponent;
  let fixture: ComponentFixture<WalletCreatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCreatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCreatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
