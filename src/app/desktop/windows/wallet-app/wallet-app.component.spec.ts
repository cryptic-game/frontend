import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAppComponent } from './wallet-app.component';

describe('WalletAppComponent', () => {
  let component: WalletAppComponent;
  let fixture: ComponentFixture<WalletAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletAppComponent]
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
