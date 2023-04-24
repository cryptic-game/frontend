import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponentsComponent } from './base-components.component';

describe('BaseComponentsComponent', () => {
  let component: BaseComponentsComponent;
  let fixture: ComponentFixture<BaseComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
