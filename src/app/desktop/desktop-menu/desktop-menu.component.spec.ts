import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DesktopMenuComponent} from './desktop-menu.component';
import {windowManagerMock} from '../../test-utils';
import {RouterTestingModule} from '@angular/router/testing';

describe('DesktopMenuComponent', () => {
  let component: DesktopMenuComponent;
  let fixture: ComponentFixture<DesktopMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DesktopMenuComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopMenuComponent);
    component = fixture.componentInstance;
    component.windowManager = windowManagerMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
