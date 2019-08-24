import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinerComponent } from './miner.component';
import { FormsModule } from '@angular/forms';

describe('MinerComponent', () => {
  let component: MinerComponent;
  let fixture: ComponentFixture<MinerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MinerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
