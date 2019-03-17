import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TerminalComponent} from './terminal.component';
import {TerminalCommandsService} from './terminal-commands.service';

describe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalComponent, TerminalCommandsService]
    })
      .compileComponents();
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
