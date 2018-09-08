import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopStartmenuComponent } from './desktop-startmenu.component';

describe('DesktopStartmenuComponent', () => {
  let component: DesktopStartmenuComponent;
  let fixture: ComponentFixture<DesktopStartmenuComponent>;

  localStorage.setItem('token', '');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopStartmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopStartmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
