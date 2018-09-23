import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopStartmenuComponent } from './desktop-startmenu.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('DesktopStartmenuComponent', () => {
  let component: DesktopStartmenuComponent;
  let fixture: ComponentFixture<DesktopStartmenuComponent>;

  localStorage.setItem('token', '');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
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
