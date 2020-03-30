import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAppComponent } from './wallet-app.component';
import { WalletAppHeaderComponent } from './wallet-app-header/wallet-app-header.component';
import { WalletAppTransactionComponent } from './wallet-app-transaction/wallet-app-transaction.component';

describe('WalletAppComponent', () => {
  let component: WalletAppComponent;
  let fixture: ComponentFixture<WalletAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletAppComponent, WalletAppHeaderComponent, WalletAppTransactionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
