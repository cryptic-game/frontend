import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalComponent } from './terminal.component';
import { HttpClientModule } from '@angular/common/http';
import { emptyWindowDelegate, windowManagerMock } from '../../../test-utils';
import { WindowManager } from '../../window-manager/window-manager';

describe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalComponent],
      providers: [
        { provide: WindowManager, useValue: windowManagerMock() }
      ],
      imports: [HttpClientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
    component.delegate = emptyWindowDelegate();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
