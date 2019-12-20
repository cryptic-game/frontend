import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAppEditComponent } from './wallet-app-edit.component';

describe('WalletAppEditComponent', () => {
  let component: WalletAppEditComponent;
  let fixture: ComponentFixture<WalletAppEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletAppEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
