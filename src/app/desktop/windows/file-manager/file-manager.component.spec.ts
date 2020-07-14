import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerComponent } from './file-manager.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../../websocket.service';
import { emptyWindowDelegate, webSocketMock } from '../../../test-utils';

describe('FileManagerComponent', () => {
  let component: FileManagerComponent;
  let fixture: ComponentFixture<FileManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocketMock() },
      ],
      declarations: [
        FileManagerComponent
      ],
      imports: [
        ContextMenuModule.forRoot(),
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerComponent);
    component = fixture.componentInstance;
    component.delegate = emptyWindowDelegate();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
