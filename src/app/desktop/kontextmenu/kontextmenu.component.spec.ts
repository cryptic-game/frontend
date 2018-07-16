import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KontextmenuComponent } from './kontextmenu.component';

describe('KontextmenuComponent', () => {
  let component: KontextmenuComponent;
  let fixture: ComponentFixture<KontextmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontextmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KontextmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
