import { Component, ElementRef, OnInit, OnDestroy, Type, ViewChild } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';
import { FileService } from '../../../api/files/file.service';
import { Path } from '../../../api/files/path';
import { File } from '../../../api/files/file';
import { Subscription } from 'rxjs';
import { WindowManager } from '../../window-manager/window-manager';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends WindowComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  delegate: EditorWindowDelegate;

  error: string;
  fileContent: string;
  fileOpened: boolean;
  filePath: Path;
  chars_left: number;
  fileUUID: string;
  deleted_popup: boolean;
  changed_popup: boolean;
  fileSubscription: Subscription;

  constructor(private fileService: FileService, private websocket: WebsocketService, private windowManager: WindowManager) {
    super();
  }

  ngOnInit() {
    this.fileOpened = false;
    this.deleted_popup = false;
    this.changed_popup = false;

    if (this.delegate.openFile != null && !this.delegate.openFile.is_directory) {
      this.fileOpened = true;
      this.fileContent = this.delegate.openFile.content;
      this.fileService.getAbsolutePath(this.delegate.device.uuid, this.delegate.openFile.uuid).subscribe(path => {
        this.fileInput.nativeElement.value = '/' + path.join('/');
        this.filePath = Path.fromString('/' + path.join('/'));
        this.fileUUID = this.delegate.openFile.uuid;
      });

      this.fileInput.nativeElement.disabled = true;
    }
    this.fileSubscription = this.websocket
      .subscribeNotification<{ created: string[], changed: string[], deleted: string[] }>('file-update')
      .subscribe((data) => {
        if (this.fileUUID === undefined) {
          return;
        }
        if (data.data.deleted !== undefined) {
          if (data.data.deleted.includes(this.fileUUID)) {
            if (this.changed_popup) {
              this.changed_popup = false;
            }
            this.deleted_popup = true;
          }
        }
        if (data.data.changed !== undefined) {
          if (data.data.changed.includes(this.fileUUID)) {
            this.fileService.getFile(this.delegate.device.uuid, this.fileUUID).subscribe(file => {
              if (this.fileContent !== file.content) {
                if (!this.deleted_popup) {
                  this.changed_popup = true;
                }
              }
            });
          }
        }
      });
  }

  ngOnDestroy() {
    this.fileSubscription.unsubscribe();
  }

  enter(inputPath: string) {
    let path: Path;
    try {
      path = Path.fromString(inputPath, Path.ROOT);
      this.filePath = path;
    } catch {
      this.error = 'Path not valid';
      return;
    }

    this.fileService.getFromPath(this.delegate.device.uuid, path).subscribe(file => {
      if (file.is_directory) {
        this.error = 'Not a file';
      } else {
        this.error = '';
        this.fileOpened = true;
        this.fileContent = file.content;
        this.fileUUID = file.uuid;
      }
    }, error => {
      if (error.message === 'file_not_found') {
        this.error = 'File was not found';
      } else {
        this.error = error.toString();
      }
    });
  }

  save() {
    this.fileService.getFromPath(this.delegate.device.uuid, this.filePath).subscribe((file) => {
      this.fileService.changeFileContent(this.delegate.device.uuid, file.uuid, this.fileContent).subscribe((resp) => {
      }, (err) => {
        console.error(err);
        if (err === 'invalid_input_data') {
          this.error = '';
        }
      });
  });


}

force_close() {
  this.windowManager.closeWindow(this.delegate);
}

reload() {
  this.fileService.getFile(this.delegate.device.uuid, this.fileUUID).subscribe(file => {
    if (this.fileContent !== file.content) {
      this.fileContent = file.content;
    }
  });
  this.changed_popup = false;
}

}


export class EditorWindowDelegate extends WindowDelegate {
  title = 'Editor';
  icon = 'assets/desktop/img/editor.svg';
  type: Type<any> = EditorComponent;

  constraints = new WindowConstraints({ minWidth: 300, minHeight: 200 });

  constructor(public openFile?: File) {
    super();
  }
}
