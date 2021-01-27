import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletFirstStartupComponent } from './wallet-first-startup.component';

describe('WalletFirstStartupComponent', () => {
  let component: WalletFirstStartupComponent;
  let fixture: ComponentFixture<WalletFirstStartupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletFirstStartupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletFirstStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
