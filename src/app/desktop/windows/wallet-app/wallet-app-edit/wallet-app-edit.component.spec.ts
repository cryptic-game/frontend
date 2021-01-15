import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAppEditComponent } from './wallet-app-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WebsocketService } from '../../../../websocket.service';
import { webSocketMock } from '../../../../test-utils';

describe('WalletAppEditComponent', () => {
  let component: WalletAppEditComponent;
  let fixture: ComponentFixture<WalletAppEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
      declarations: [WalletAppEditComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
