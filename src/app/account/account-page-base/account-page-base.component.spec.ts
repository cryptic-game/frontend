import {AccountPageBaseComponent} from './account-page-base.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

describe('AccountPageBaseComponent', () => {
  let component: AccountPageBaseComponent;
  let fixture: ComponentFixture<AccountPageBaseComponent>;

  beforeEach(waitForAsync(() => {
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
