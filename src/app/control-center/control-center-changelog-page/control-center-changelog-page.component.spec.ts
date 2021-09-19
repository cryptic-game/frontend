import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ControlCenterChangelogPageComponent } from './control-center-changelog-page.component';
import { HttpClientModule } from '@angular/common/http';

describe('ControlCenterChangelogPageComponent', () => {
  let component: ControlCenterChangelogPageComponent;
  let fixture: ComponentFixture<ControlCenterChangelogPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterChangelogPageComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterChangelogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
