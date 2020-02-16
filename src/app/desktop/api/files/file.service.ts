import { Injectable } from '@angular/core';
import { WebsocketService } from '../../../websocket.service';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { File } from './file';
import { Path } from './path';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private webSocket: WebsocketService) {
  }

  getFiles(deviceUUID: string, parentUUID: string = Path.ROOT): Observable<File[]> {
    return this.webSocket.ms('device', ['file', 'all'], { device_uuid: deviceUUID, parent_dir_uuid: parentUUID })
      .pipe(map((response: any) => {
        if ('error' in response) {
          throw new Error(response['error']);
        }
        return response['files'];
      }));
  }

  getFilesRecursively(deviceUUID: string, parentUUID: string = Path.ROOT): Observable<File[]> {
    return this.getFiles(deviceUUID, parentUUID).pipe(flatMap(files => {
      const allChildren = files.filter(f => f.is_directory).map(f => this.getFilesRecursively(deviceUUID, f.uuid).pipe(take(1)));
      if (allChildren.length === 0) {
        return of(files);
      } else {
        return combineLatest(allChildren).pipe(map(children => {
          return Array.prototype.concat.apply(files, children);  // Concatenate files and elements of children (flattened)
        }));
      }
    }));
  }

  getRootFile(deviceUUID: string): File {
    return { content: '', device: deviceUUID, filename: '', is_directory: true, parent_dir_uuid: Path.ROOT, uuid: Path.ROOT };
  }

  getFile(deviceUUID: string, fileUUID: string): Observable<File> {
    if (fileUUID === Path.ROOT) {
      return of(this.getRootFile(deviceUUID));
    }

    return this.webSocket.ms('device', ['file', 'info'], { device_uuid: deviceUUID, file_uuid: fileUUID }).pipe(map((response: any) => {
      if ('error' in response) {
        throw new Error(response['error']);
      }
      return response;
    }));
  }

  move(deviceUUID: string, fileUUID: string, parentUUID: string, filename: string): Observable<File> {
    return this.webSocket.ms('device', ['file', 'move'], {
      device_uuid: deviceUUID,
      file_uuid: fileUUID,
      new_parent_dir_uuid: parentUUID,
      new_filename: filename
    }).pipe(map((response: any) => {
      if ('error' in response) {
        throw new Error(response['error']);
      }
      return response;
    }));
  }

  changeFileContent(deviceUUID: string, fileUUID: string, content: string): Observable<File> {
    return this.webSocket.ms('device', ['file', 'update'], { device_uuid: deviceUUID, file_uuid: fileUUID, content: content })
      .pipe(map((response: any) => {
        if ('error' in response) {
          throw new Error(response['error']);
        }
        return response;
      }));
  }

  deleteFile(deviceUUID: string, fileUUID: string): Observable<any> {
    return this.webSocket.ms('device', ['file', 'delete'], { device_uuid: deviceUUID, file_uuid: fileUUID }).pipe(map((response: any) => {
      if ('error' in response) {
        throw new Error(response['error']);
      }
      return response;
    }));
  }

  createFile(deviceUUID: string, name: string, content: string = '', parentUUID: string = Path.ROOT): Observable<File> {
    return this.webSocket.ms('device', ['file', 'create'], {
      device_uuid: deviceUUID,
      filename: name,
      content: content,
      parent_dir_uuid: parentUUID,
      is_directory: false
    }).pipe(map((response: any) => {
      if ('error' in response) {
        throw new Error(response['error']);
      }
      return response;
    }));
  }

  createDirectory(deviceUUID: string, name: string, parentUUID: string = Path.ROOT) {
    return this.webSocket.ms('device', ['file', 'create'], {
      device_uuid: deviceUUID,
      filename: name,
      content: '',
      parent_dir_uuid: parentUUID,
      is_directory: true
    }).pipe(map((response: any) => {
      if ('error' in response) {
        throw new Error(response['error']);
      }
      return response;
    }));
  }

  getAbsolutePath(deviceUUID: string, fileId: string): Observable<string[]> {
    if (fileId === Path.ROOT) {
      return of([]);
    }

    const getTree: ((file: File) => Observable<string[]>) = (file: File) => {
      if (file.parent_dir_uuid === Path.ROOT) {
        return of([file.filename]);
      }
      return this.getFile(deviceUUID, file.parent_dir_uuid).pipe(flatMap(parent => {
        return getTree(parent).pipe(map(tree => {
          return tree.concat(file.filename);
        }));
      }));
    };

    return this.getFile(deviceUUID, fileId).pipe(flatMap(file => {
      return getTree(file);
    }));
  }

  getFromPath(deviceUUID: string, path: Path): Observable<File> {
    if (path.path.length === 0) {
      return throwError(new Error('file_not_found'));
    }

    if (path.path[0] === '.') {
      if (path.path.length === 1) {
        return this.getFile(deviceUUID, path.parentUUID);
      } else {
        return this.getFromPath(deviceUUID, new Path(path.path.slice(1), path.parentUUID));
      }
    }

    if (path.path[0] === '..') {
      return this.getFile(deviceUUID, path.parentUUID).pipe(flatMap(par => {
        if (path.path.length === 1) {
          return this.getFile(deviceUUID, par.parent_dir_uuid);
        } else {
          return this.getFromPath(deviceUUID, new Path(path.path.slice(1), par.parent_dir_uuid));
        }
      }));
    }

    return this.getFiles(deviceUUID, path.parentUUID).pipe(flatMap(files => {
      for (const file of files) {
        if (file.parent_dir_uuid === path.parentUUID && file.filename === path.path[0]) {
          if (path.path.length > 1) {
            if (file.is_directory) {
              return this.getFromPath(deviceUUID, new Path(path.path.slice(1), file.uuid));
            } else {
              throw new Error('file_not_found');
            }
          } else {
            return of(file);
          }
        }
      }
      throw new Error('file_not_found');
    }));
  }

  moveToPath(source: File, destPath: Path): Observable<File> {
    const deviceUUID = source.device;
    return this.getFromPath(deviceUUID, destPath).pipe(flatMap(destination => {
      if (!destination.is_directory) {
        throw new Error('destination_is_file');
      }
      return this.getFiles(deviceUUID, destination.uuid).pipe(flatMap(destinationFiles => {
          if (destinationFiles.find(f => f.filename === source.filename)) {
            throw new Error('file_already_exists');
          } else {
            return this.move(deviceUUID, source.uuid, destination.uuid, source.filename);
          }
        }
      ));
    }));
  }

  copyFile(source: File, destPath: Path): Observable<File> {
    const deviceUUID = source.device;

    /**
     * check dest
     * - file? already existing
     * - directory? then copy with same name
     * - not existing?
     *   - check dest parent folder
     *     - does not exist? destination_not_found
     *     - contains file with dest name? already existing
     *     - does not contain:
     *       - create file
     */

    if (source.is_directory) {
      return throwError(new Error('cannot_copy_directory'));
    }

    let destFileName = source.filename;

    return this.getFromPath(deviceUUID, destPath).pipe(catchError(err => {
      if (err.message === 'file_not_found') {
        if (destPath.path.length <= 1) {
          destFileName = destPath.path.length === 1 ? destPath.path[0] : source.filename;
          return this.getFile(deviceUUID, destPath.parentUUID);
        } else {
          destFileName = destPath.path[destPath.path.length - 1];

          const destDirPath = new Path(destPath.path.slice(0, -1), destPath.parentUUID);
          return this.getFromPath(deviceUUID, destDirPath).pipe(catchError(error => {
            if (error.message === 'file_not_found') {
              throw new Error('destination_not_found');
            } else {
              throw error;
            }
          }), map(destDir => {
            if (!destDir.is_directory) {
              throw new Error('destination_not_found');
            }

            return destDir;
          }));
        }
      } else {
        throw err;
      }
    }), flatMap(destination => {
      if (!destination.is_directory) {
        throw new Error('file_already_exists');
      }

      return this.getFiles(deviceUUID, destination.uuid).pipe(flatMap(destDirFiles => {
        if (destDirFiles.find(f => f.filename === destFileName)) {
          throw new Error('file_already_exists');
        }

        return this.createFile(deviceUUID, destFileName, source.content, destination.uuid);
      }));
    }));

  }

  rename(file: File, newName: string): Observable<File> {
    return this.move(file.device, file.uuid, file.parent_dir_uuid, newName);
  }


}
