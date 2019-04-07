import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalComponent } from './terminal.component';
import { HttpClientModule } from '@angular/common/http';

describe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  sessionStorage.setItem('username', '');
  sessionStorage.setItem('activeDevice', JSON.stringify({name: ''}));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalComponent],
      imports: [HttpClientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
