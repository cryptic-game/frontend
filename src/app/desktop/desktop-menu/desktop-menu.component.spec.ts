import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopMenuComponent } from './desktop-menu.component';

describe('DesktopMenuComponent', () => {
  let component: DesktopMenuComponent;
  let fixture: ComponentFixture<DesktopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
