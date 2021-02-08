import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletImportPopupComponent } from './wallet-import-popup.component';

describe('WalletImportPopupComponent', () => {
  let component: WalletImportPopupComponent;
  let fixture: ComponentFixture<WalletImportPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletImportPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletImportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
