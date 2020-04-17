import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAppTransactionComponent } from './wallet-app-transaction.component';

describe('WalletAppTransactionComponent', () => {
  let component: WalletAppTransactionComponent;
  let fixture: ComponentFixture<WalletAppTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletAppTransactionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
