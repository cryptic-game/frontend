import {Component, OnDestroy, OnInit, Type} from '@angular/core';
import {WindowComponent, WindowConstraints, WindowDelegate} from '../../window/window-delegate';
import {File} from '../../../api/files/file';
import {Path} from '../../../api/files/path';
import {FileService} from '../../../api/files/file.service';
import {WebsocketService} from '../../../websocket.service';
import {Subscription} from 'rxjs';
import {WindowManager} from '../../window-manager/window-manager';
import {EditorWindowDelegate} from '../editor/editor.component';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent extends WindowComponent implements OnInit, OnDestroy {
  // @ViewChild('dragDropMenu') dragDropMenu: ContextMenuComponent;

  override delegate: FileManagerWindowDelegate | WindowDelegate;

  addressBarURL = '/';
  status = '';
  errorTimeoutID: any;
  confirmResolve: (confirmed: boolean) => void;
  public currentFolder: File;
  public currentFolderFiles: File[];

  fileUpdateSubscription: Subscription;

  constructor(public fileService: FileService,
              private apiService: WebsocketService,
              // private contextMenuService: ContextMenuService,
              private windowManager: WindowManager) {
    super();
  }

  ngOnInit() {
    this.currentFolder = this.fileService.getRootFile(this.delegate.device.uuid);
    if (this.delegate instanceof FileManagerWindowDelegate) {
      this.goToFolderUUID(this.delegate.openDirectory?.is_directory ? this.delegate.openDirectory.uuid : Path.ROOT!);
    }

    this.fileUpdateSubscription = this.apiService
      .subscribeNotification<{ created: string[]; changed: string[]; deleted: string[] }>('file-update')
      .subscribe(notification => {
        if (notification.data.created || notification.data.changed) {
          this.updateFiles();
        } else if (notification.data.deleted) {
          this.currentFolderFiles = this.currentFolderFiles.filter(file => file.uuid in notification.data.deleted);
        }
      });
  }

  ngOnDestroy() {
    this.fileUpdateSubscription.unsubscribe();
  }

  displayError(error: string) {
    if (this.confirmResolve) {
      this.confirmResolve(false);
      this.confirmResolve = undefined!;
    }
    clearTimeout(this.errorTimeoutID);
    this.status = error;
    this.errorTimeoutID = setTimeout(() => this.status = '', 5000);
  }

  displayConfirm(message: string): Promise<boolean> {
    if (this.confirmResolve) {
      this.confirmResolve(false);
    }
    clearTimeout(this.errorTimeoutID);
    this.status = message;
    return new Promise(resolve => this.confirmResolve = resolve);
  }

  respondConfirm(response: boolean) {
    if (this.confirmResolve) {
      this.confirmResolve(response);
    }
    this.status = '';
    this.confirmResolve = undefined!;
  }

  updateFiles() {
    this.fileService.getFiles(this.delegate.device.uuid, this.currentFolder.uuid).subscribe({
      next: (result: File[]) => this.currentFolderFiles = result
    });
  }

  navigateByAddress() {
    this.fileService.getFromPath(
      this.delegate.device.uuid,
      Path.fromString(this.addressBarURL, Path.ROOT!)
    ).subscribe({
      next: (result: File) => {
        if (result.is_directory) {
          this.currentFolder = result;
          this.updateFiles();
        }
      },
      error: (e: Error) => {
        // @ts-ignore
        if (e.message === 'file_not_found') {
          this.displayError('The specified folder was not found.');
          // @ts-ignore
        } else if (e.message === 'invalid_path') {
          this.displayError('The specified path is not valid.');
        } else {
          // @ts-ignore
          this.displayError(e.message);
          console.warn(e);
        }
      }
    })

  }

  updateAddressBar() {
    this.fileService.getAbsolutePath(this.delegate.device.uuid, this.currentFolder.uuid).subscribe({
      next: (result: string[]) => {
        this.addressBarURL = new Path(result).toString();
      }
    })
  }

  goToFolderUUID(uuid: string) {
    try {
      this.fileService.getFile(this.delegate.device.uuid, uuid).subscribe({
        next: (result: File) => this.currentFolder = result
      })

      this.updateFiles();
      this.updateAddressBar();
    } catch (e) {
      // @ts-ignore
      if (e.message === 'file_not_found') {
        this.displayError('The specified folder was not found.');
      } else {
        // @ts-ignore
        this.displayError(e.message);
        console.warn(e);
      }
    }
  }

  goToParent() {
    this.goToFolderUUID(this.currentFolder.parent_dir_uuid);
  }

  dragStart(event: DragEvent, source: File) {
    event.dataTransfer?.setData('cryptic/file', source.uuid);
  }

  dragOver(event: DragEvent, destination: File) {
    if (destination.is_directory && event.dataTransfer?.types.length === 1 && event.dataTransfer.types[0] === 'cryptic/file') {
      event.preventDefault();
    }
  }

  dragOverParentFolder(event: DragEvent) {
    if (event.dataTransfer?.types.length === 1 && event.dataTransfer.types[0] === 'cryptic/file') {
      event.preventDefault();
    }
  }

  dropMove(event: { event: Event; item: { file: File; destinationUUID: string } }) {
    const file = event.item?.file;
    const destinationUUID = event.item?.destinationUUID;

    this.fileService.move(this.delegate.device.uuid, file.uuid, destinationUUID, file.filename).subscribe({
      error: (e: Error) => {
        // @ts-ignore
        if (e.message === 'file_already_exists') {
          this.displayError('A file with the same name already exists.');
          // @ts-ignore
        } else if (e.message === 'file_not_found') {
          this.displayError('The dragged file was not found.');
        } else {
          // @ts-ignore
          this.displayError(e.message);
          console.warn(e);
        }
      }
    });

  }

  dropCopy(event: { event: Event; item: { file: File; destinationUUID: string } }) {
    const file = event.item?.file;
    const destinationUUID = event.item?.destinationUUID;

    this.fileService
      .createFile(this.delegate.device.uuid, file.filename, file.content, destinationUUID)
      .subscribe({
        error: (e: Error) => {
          // @ts-ignore
          if (e.message === 'file_already_exists') {
            this.displayError('A file with the same name already exists.');
            // @ts-ignore
          } else if (e.message === 'file_not_found') {
            this.displayError('The dragged file was not found.');
          } else {
            // @ts-ignore
            this.displayError(e.message);
            console.warn(e);
          }
        }
      })


  }

  dragDrop(event: DragEvent, destinationUUID: string) {
    const sourceUUID = event.dataTransfer?.getData('cryptic/file')!;

    event.stopPropagation();

    this.fileService.getFile(this.delegate.device.uuid, sourceUUID).subscribe({
        next: (result: File) => {
          if (result.parent_dir_uuid === destinationUUID) {
            return;
          }
          //TODO Implement context menu
          // this.contextMenuService.show.next({
          //   contextMenu: this.dragDropMenu,
          //   item: { file: sourceFile, destinationUUID: destinationUUID },
          //   event: event
          // });
        },
        error: () => {
          return;
        }
      }
    );
  }

  rename(file: File, newName: string) {
    if (file.filename === newName) {
      return;
    }

    Object.assign(
      file,
      this.fileService.rename(file, newName).subscribe({
        error: (e: Error) => {
          // @ts-ignore
          if (e.message === 'file_already_exists') {
            this.displayError('A file with the same name already exists.');
            // @ts-ignore
          } else if (e.message === 'invalid_input_data') {
            this.displayError('The specified name is not valid.');
          } else {
            // @ts-ignore
            this.displayError(e.message);
            console.warn(e);
          }
        }
      })
    );
  }

  newFile(name: string) {
    this.fileService
      .createFile(this.delegate.device.uuid, name, '', this.currentFolder.uuid)
      .subscribe({
        error: (e: Error) => {
          // @ts-ignore
          if (e.message === 'file_already_exists') {
            this.displayError('A file with the same name already exists.');
            // @ts-ignore
          } else if (e.message === 'invalid_input_data') {
            this.displayError('The specified name is not valid.');
          } else {
            // @ts-ignore
            this.displayError(e.message);
            console.warn(e);
          }
        }
      });
  }

  newFolder(name: string) {
    this.fileService.createDirectory(this.delegate.device.uuid, name, this.currentFolder.uuid).subscribe({
      error: (e: Error) => {
        // @ts-ignore
        if (e.message === 'file_already_exists') {
          this.displayError('A file with the same name already exists.');
          // @ts-ignore
        } else if (e.message === 'invalid_input_data') {
          this.displayError('The specified folder name is not valid.');
        } else {
          // @ts-ignore
          this.displayError(e.message);
          console.warn(e);
        }
      }
    });
  }

  async delete(file: File) {
    let confirmed = true;

    if (file.is_directory) {
      confirmed = await this.displayConfirm('Are you sure you want to delete this folder? You might lose access to a wallet.');
    } else if (file.content.trim().length === 47) {
      const walletCred = file.content.split(' ');
      const uuid = walletCred[0];
      const key = walletCred[1];

      if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
        try {
          await this.apiService.ms('currency', ['get'], {source_uuid: uuid, key: key}).toPromise();
          confirmed = await this.displayConfirm('Do you really want to delete this wallet? You will lose your coins.');
          if (confirmed) {
            await this.apiService.ms('currency', ['delete'], {source_uuid: uuid, key: key}).toPromise();
          }
        } catch (e) {
          // @ts-ignore
          if (e.message === 'unknown_source_or_destination' || e.message === 'permission_denied') {
            confirmed = true;
          } else {
            // @ts-ignore
            this.displayError(e.message);
            confirmed = false;
          }
        }
      }
    }

    if (confirmed) {
      this.fileService.deleteFile(this.delegate.device.uuid, file.uuid).subscribe();
    }
  }

  open(file: File) {
    this.windowManager.openWindow(new EditorWindowDelegate(file));
  }

}

export class FileManagerWindowDelegate extends WindowDelegate {
  title = 'File Manager';
  icon = 'assets/desktop/img/filemanager.svg';
  type: Type<any> = FileManagerComponent;

  override constraints = new WindowConstraints({minWidth: 330, minHeight: 280});

  constructor(public openDirectory?: File) {
    super();
  }
}
