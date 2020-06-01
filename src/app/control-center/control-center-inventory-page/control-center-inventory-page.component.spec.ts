import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterInventoryPageComponent } from './control-center-inventory-page.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('ControlCenterInventoryPageComponent', () => {
  let component: ControlCenterInventoryPageComponent;
  let fixture: ComponentFixture<ControlCenterInventoryPageComponent>;
  let activatedRoute;

  beforeEach(async(() => {
    activatedRoute = { queryParamMap: jasmine.createSpyObj(['subscribe']), data: jasmine.createSpyObj(['subscribe']) };

    TestBed.configureTestingModule({
      declarations: [ControlCenterInventoryPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      imports: [
        FormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterInventoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
