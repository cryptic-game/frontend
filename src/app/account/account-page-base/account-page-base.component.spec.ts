import { AccountPageBaseComponent } from './account-page-base.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('AccountPageBaseComponent', () => {
  let component: AccountPageBaseComponent;
  let fixture: ComponentFixture<AccountPageBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPageBaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
