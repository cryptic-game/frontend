import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletFirstStartupCreateImportComponent } from './wallet-first-startup-create-import.component';

describe('WalletFirstStartupCreateImportComponent', () => {
  let component: WalletFirstStartupCreateImportComponent;
  let fixture: ComponentFixture<WalletFirstStartupCreateImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletFirstStartupCreateImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletFirstStartupCreateImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
