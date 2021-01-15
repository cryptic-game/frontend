import { inject, TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import * as rxjs from 'rxjs';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../websocket.service';
import { File } from './file';
import { Path } from './path';

describe('FileService', () => {
  const testUUIDs = [
    'f830536d-5401-47f3-a1a1-8cd0ae1fb9aa',
    '733e00ee-0aad-4de7-ad8a-2120dc87d224',
    '351ca6dd-1570-41a2-b464-b903dab63bc0',
    'cbc28567-4757-4d10-8d62-c5e5d3324361',
    'c82bb5f7-a168-4e58-b737-c19b6e9478d4',
    '4f8f935e-84f1-4702-80ac-4cd6d6f97c05'
  ];
  let testFiles: File[];

  let webSocket;

  function getTestFiles(deviceUUID: string = '', parentUUID: string = Path.ROOT): Observable<File[]> {
    if (!(parentUUID === Path.ROOT || testFiles.find(f => f.uuid === parentUUID))) {
      fail('An unknown parent directory UUID was requested: ' + parentUUID);
    }
    return rxjs.of(testFiles.filter(f => f.parent_dir_uuid === parentUUID));
  }

  function getTestFile(deviceUUID: string = '', uuid: string): Observable<File> {
    const file = testFiles.find(f => f.uuid === uuid);
    if (file) {
      return rxjs.of(file);
    } else {
      return rxjs.throwError(new Error('file_not_found'));
    }
  }


  beforeEach(() => {
    webSocket = jasmine.createSpyObj('WebsocketService', ['ms']);
    webSocket.ms.and.returnValue(rxjs.of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocket }
      ]
    });
  });

  beforeAll(() => {
    Path.ROOT = 'test-root';
    testFiles = [
      // - 0 (file)
      // - 1 (dir)
      //   - 2 (dir)
      //     - 3 (file)
      //     - 4 (dir)
      //   - 5 (file)
      { uuid: testUUIDs[0], parent_dir_uuid: Path.ROOT, is_directory: false, filename: '0' } as any,
      { uuid: testUUIDs[1], parent_dir_uuid: Path.ROOT, is_directory: true, filename: '1' } as any,
      { uuid: testUUIDs[2], parent_dir_uuid: testUUIDs[1], is_directory: true, filename: '2' } as any,
      { uuid: testUUIDs[3], parent_dir_uuid: testUUIDs[2], is_directory: false, filename: '3' } as any,
      { uuid: testUUIDs[4], parent_dir_uuid: testUUIDs[2], is_directory: true, filename: '4' } as any,
      { uuid: testUUIDs[5], parent_dir_uuid: testUUIDs[1], is_directory: false, filename: '5' } as any,
    ];
  });

  afterAll(() => {
    Path.ROOT = null;
  });

  it('should be created', inject([FileService], (service: FileService) => {
    expect(service).toBeTruthy();
  }));

  it('#getFiles() should make a request to device/file/all and return files of the response',
    inject([FileService], (service: FileService) => {
      const data = ['123', '24536', '6342'] as any;
      webSocket.ms.and.returnValue(rxjs.of({ files: data }));

      service.getFiles(testUUIDs[0], testUUIDs[1]).subscribe(files => {
        expect(files).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'all'], { device_uuid: testUUIDs[0], parent_dir_uuid: testUUIDs[1] });
      });
    })
  );

  it('#getFiles() should use Path.ROOT as default if parentUUID is not specified',
    inject([FileService], (service: FileService) => {
      service.getFiles(testUUIDs[2]);
      expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'all'], { device_uuid: testUUIDs[2], parent_dir_uuid: Path.ROOT });
    })
  );

  it('#getFilesRecursively() should go through all folders and return all the files and folders recursively',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFilesRecursively(testUUIDs[0]).subscribe(files => {
        expect(files.length).toEqual(testFiles.length);
        for (const f of testFiles) {
          expect(files).toContain(f);
        }
      }, error => {
        fail(error.message);
      });
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], Path.ROOT);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[1]);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[2]);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[4]);
    }));

  it('#getFilesRecursively() should not go inside a file like a folder',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFilesRecursively(testUUIDs[0], Path.ROOT).subscribe();

      expect(service.getFiles).not.toHaveBeenCalledWith(testUUIDs[0], testUUIDs[0]);
      expect(service.getFiles).not.toHaveBeenCalledWith(testUUIDs[0], testUUIDs[3]);
      expect(service.getFiles).not.toHaveBeenCalledWith(testUUIDs[0], testUUIDs[5]);
    })
  );

  it('#getFilesRecursively() should only look inside one folder recursively if parentUUID is given',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFilesRecursively(testUUIDs[1], testUUIDs[2]).subscribe(value => {
        expect(value).toEqual([testFiles[3], testFiles[4]]);
      }, error => {
        fail(error.message);
      });

      expect(service.getFiles).not.toHaveBeenCalledWith(testUUIDs[1], Path.ROOT);
      expect(service.getFiles).not.toHaveBeenCalledWith(testUUIDs[1], testUUIDs[1]);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[1], testUUIDs[2]);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[1], testUUIDs[4]);
    })
  );

  it('#getFile() should make a request to device/file/info and return the response',
    inject([FileService], (service: FileService) => {
      const data = { a: 'b', c: 'd', e: 'f', ghi: 'jkl' } as any;
      webSocket.ms.and.returnValue(rxjs.of(data));


      service.getFile(testUUIDs[0], testUUIDs[1]).subscribe(response => {
        expect(response).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'info'], { device_uuid: testUUIDs[0], file_uuid: testUUIDs[1] });
      });
    })
  );

  it('#getRootFile() should return an empty dummy directory with the right device UUID', inject([FileService], (service: FileService) => {
    const file = service.getRootFile(testUUIDs[0]);
    expect(file.uuid).toEqual(Path.ROOT);
    expect(file.is_directory).toBeTruthy();
    expect(file.filename).toEqual('');
    expect(file.parent_dir_uuid).toEqual(Path.ROOT);
    expect(file.device).toEqual(testUUIDs[0]);
    expect(file.content).toEqual('');
  }));

  it('#getFile() should return the root file from getRootFile() if the UUID is Path.ROOT', inject([FileService], (service: FileService) => {
      spyOn(service, 'getRootFile').and.returnValue(testFiles[4]);

      service.getFile(testUUIDs[0], Path.ROOT).subscribe(file => {
        expect(service.getRootFile).toHaveBeenCalledWith(testUUIDs[0]);
        expect(file).toEqual(testFiles[4]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#move() should make a request to device/file/move and return the response',
    inject([FileService], (service: FileService) => {
      const fileName = 'testfilename_xyz';
      const data = { a: 'b', c: 'd', e: 'f', ghi: 'jkl' } as any;
      webSocket.ms.and.returnValue(rxjs.of(data));

      service.move(testUUIDs[0], testUUIDs[1], testUUIDs[2], fileName).subscribe(response => {
        expect(response).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'move'], {
          device_uuid: testUUIDs[0],
          file_uuid: testUUIDs[1],
          new_parent_dir_uuid: testUUIDs[2],
          new_filename: fileName
        });
      });
    })
  );

  it('#changeFileContent() should make a request to device/file/update and return the response',
    inject([FileService], (service: FileService) => {
      const fileContent = 'This is the content of a test file.';
      const data = { a: 'b', c: 'd', e: 'f', ghi: 'jkl' } as any;
      webSocket.ms.and.returnValue(rxjs.of(data));

      service.changeFileContent(testUUIDs[0], testUUIDs[1], fileContent).subscribe(response => {
        expect(response).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'update'], {
          device_uuid: testUUIDs[0],
          file_uuid: testUUIDs[1],
          content: fileContent
        });
      });
    })
  );

  it('#deleteFile() should make a request to device/file/delete and return the response',
    inject([FileService], (service: FileService) => {
      const data = { a: 'b', c: 'd', e: 'f', ghi: 'jkl' } as any;
      webSocket.ms.and.returnValue(rxjs.of(data));

      service.deleteFile(testUUIDs[0], testUUIDs[1]).subscribe(response => {
        expect(response).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'delete'], { device_uuid: testUUIDs[0], file_uuid: testUUIDs[1] });
      });
    })
  );

  it('#createFile() should make a request to device/file/create with is_directory set to false and return the response',
    inject([FileService], (service: FileService) => {
      const fileName = 'some_file_name';
      const fileContent = 'This is an example file content.';
      const data = { a: 'b', c: 'd', e: 'f', ghi: 'jkl' } as any;
      webSocket.ms.and.returnValue(rxjs.of(data));

      service.createFile(testUUIDs[0], fileName, fileContent, testUUIDs[1]).subscribe(response => {
        expect(response).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'create'], {
          device_uuid: testUUIDs[0],
          filename: fileName,
          content: fileContent,
          parent_dir_uuid: testUUIDs[1],
          is_directory: false
        });
      });
    })
  );

  it('#createFile() should use Path.ROOT as default if parentUUID is not specified and an empty string as default for the file content',
    inject([FileService], (service: FileService) => {
      const fileName = 'example_file_name';
      service.createFile(testUUIDs[2], fileName);
      expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'create'], {
        device_uuid: testUUIDs[2],
        filename: fileName,
        content: '',
        parent_dir_uuid: Path.ROOT,
        is_directory: false
      });
    })
  );

  it('#createDirectory() should make a request to device/file/create with is_directory set to true and content set empty and return the response',
    inject([FileService], (service: FileService) => {
      const dirName = 'some_directory_name';
      const data = { a: 'b', c: 'd', e: 'f', ghi: 'jkl' } as any;
      webSocket.ms.and.returnValue(rxjs.of(data));

      service.createDirectory(testUUIDs[0], dirName, testUUIDs[1]).subscribe(response => {
        expect(response).toEqual(data);
        expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'create'], {
          device_uuid: testUUIDs[0],
          filename: dirName,
          content: '',
          parent_dir_uuid: testUUIDs[1],
          is_directory: true
        });
      });
    })
  );

  it('#createDirectoy() should use Path.ROOT as default if parentUUID is not specified',
    inject([FileService], (service: FileService) => {
      const fileName = 'example_file_name';
      service.createDirectory(testUUIDs[2], fileName);
      expect(webSocket.ms).toHaveBeenCalledWith('device', ['file', 'create'], {
        device_uuid: testUUIDs[2],
        filename: fileName,
        content: '',
        parent_dir_uuid: Path.ROOT,
        is_directory: true
      });
    })
  );

  it('#getAbsolutePath() should return an empty list if the path is already the root', inject([FileService], (service: FileService) => {
    service.getAbsolutePath(testUUIDs[0], Path.ROOT).subscribe(value => {
      expect(value).toEqual([]);
    }, error => {
      fail(error.message);
    });
  }));

  it('#getAbsolutePath() should return the absolute path of a file as an array of directory and file name strings',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);

      service.getAbsolutePath(testUUIDs[0], testUUIDs[3]).subscribe(value => {
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[3]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[2]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[1]);
        expect(value).toEqual(['1', '2', '3']);
      }, error => {
        fail(error.message);
      });

      service.getAbsolutePath(testUUIDs[0], testUUIDs[4]).subscribe(value => {
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[4]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[2]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[1]);
        expect(value).toEqual(['1', '2', '4']);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#getFromPath() should throw a "file_not_found" error if the path is empty', inject([FileService], (service: FileService) => {
    service.getFromPath(testUUIDs[0], new Path([])).subscribe(() => {
      fail('getFromPath() unexpectedly returned a value instead of a file_not_found error');
    }, error => {
      expect(error.message).toEqual('file_not_found');
    });
  }));

  it('#getFromPath() should return the parentUUID file if the remaining path is just "."',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.returnValue(rxjs.of(testFiles[1]));

      service.getFromPath(testUUIDs[0], new Path(['.'], testUUIDs[1])).subscribe(file => {
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[1]);
        expect(file).toEqual(testFiles[1]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#getFromPath() should continue with the next part of the path if the current is "."',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFromPath(testUUIDs[0], new Path(['.', '1', '.', '2'])).subscribe(file => {
        expect(file).toEqual(testFiles[2]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#getFromPath() should continue with the parent of parentUUID if the current path part is ".."',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFromPath(testUUIDs[0], new Path(['..'], testUUIDs[3])).subscribe(file => {
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[3]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[2]);
        expect(file).toEqual(testFiles[2]);
      }, error => {
        fail(error.message);
      });

      service.getFromPath(testUUIDs[0], new Path(['..', '4', '..', '..', '5'], testUUIDs[3])).subscribe(file => {
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[3]);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[2]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[4]);
        expect(service.getFile).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[2]);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testUUIDs[1]);
        expect(file).toEqual(testFiles[5]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#getFromPath() should go through the path and return the matching file/directory from #getFiles() of the last name if there is one',
    inject([FileService], (service: FileService) => {
      // - 0 (file)
      // - 1 (dir)
      //   - 2 (dir)
      //     - 3 (file)
      //     - 4 (dir)
      //   - 5 (file)
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      let successes = 0;
      service.getFromPath(testUUIDs[0], new Path(['1', '2', '3'])).subscribe(file => {
        expect(file).toEqual(testFiles[3]);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], Path.ROOT);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testFiles[1].uuid);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], testFiles[2].uuid);
        successes += 1;
      });
      service.getFromPath(testUUIDs[1], new Path(['0'])).subscribe(file => {
        expect(file).toEqual(testFiles[0]);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[1], Path.ROOT);
        successes += 1;
      });
      service.getFromPath(testUUIDs[2], new Path(['1', '5'])).subscribe(file => {
        expect(file).toEqual(testFiles[5]);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[2], Path.ROOT);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[2], testFiles[1].uuid);
        successes += 1;
      });
      service.getFromPath(testUUIDs[3], new Path(['1', '2', '4'])).subscribe(file => {
        expect(file).toEqual(testFiles[4]);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[3], Path.ROOT);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[3], testFiles[1].uuid);
        expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[3], testFiles[2].uuid);
        successes += 1;
      });

      expect(successes).toEqual(4, 'A getFromPath test case threw an error or did not return anything');
    })
  );

  it('#getFromPath() should throw a "file_not_found" error if a part of the path except the last is no directory',
    inject([FileService], (service: FileService) => {
      // - 0 (file)
      // - 1 (dir)
      //   - 2 (dir)
      //     - 3 (file)
      //     - 4 (dir)
      //   - 5 (file)
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFromPath(testUUIDs[0], new Path(['0', '2'])).subscribe(() => {
        fail('getFromPath() with path 0/2 unexpectedly returned a file');
      }, error => {
        expect(error.message).toEqual('file_not_found');
      });

      service.getFromPath(testUUIDs[0], new Path(['1', '5', '4'])).subscribe(() => {
        fail('getFromPath() with path 1/5/4 unexpectedly returned a file');
      }, error => {
        expect(error.message).toEqual('file_not_found');
      });
    })
  );

  it('#getFromPath() should throw a "file_not_found" error if a part of the path does not exist',
    inject([FileService], (service: FileService) => {
      // - 0 (file)
      // - 1 (dir)
      //   - 2 (dir)
      //     - 3 (file)
      //     - 4 (dir)
      //   - 5 (file)
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.getFromPath(testUUIDs[0], new Path(['10', '13'])).subscribe(() => {
        fail('getFromPath() with path 10/13 unexpectedly returned a file');
      }, error => {
        expect(error.message).toEqual('file_not_found');
      });

      service.getFromPath(testUUIDs[0], new Path(['2', '3'])).subscribe(() => {
        fail('getFromPath() with path 2/3 unexpectedly returned a file');
      }, error => {
        expect(error.message).toEqual('file_not_found');
      });

      service.getFromPath(testUUIDs[0], new Path(['5', '6'])).subscribe(() => {
        fail('getFromPath() with path 5/6 unexpectedly returned a file');
      }, error => {
        expect(error.message).toEqual('file_not_found');
      });

      service.getFromPath(testUUIDs[0], new Path(['4', '7'])).subscribe(() => {
        fail('getFromPath() with path 4/7 unexpectedly returned a file');
      }, error => {
        expect(error.message).toEqual('file_not_found');
      });
    })
  );

  it('#getFromPath() should use Path.ROOT as default if parentUUID is not specified',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFiles').and.returnValue(rxjs.of([]));

      service.getFromPath(testUUIDs[0], new Path(['1', '2', '3']));
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], Path.ROOT);
    })
  );

  it('#moveToPath() should throw a "destination_is_file" error if the destination path is not a directory',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFromPath').and.returnValue(rxjs.of({ is_directory: false } as any));
      const destPath = new Path([], '');

      service.moveToPath({} as any, destPath).subscribe(() => {
        fail('moveToPath() with a file as destination unexpectedly returned a value');
      }, error => {
        expect(error.message).toEqual('destination_is_file');
      });

      expect(service.getFromPath).toHaveBeenCalledWith(undefined, destPath);
    })
  );

  it('#moveToPath() should throw a "file_already_exists" error if a file with the same name already exists',
    inject([FileService], (service: FileService) => {
      const dest: File = {
        content: '', device: testUUIDs[0], filename: '1', is_directory: true, parent_dir_uuid: Path.ROOT, uuid: testUUIDs[1]
      };
      const source: File = {
        content: '', device: testUUIDs[0], filename: '2',
        is_directory: false, parent_dir_uuid: testUUIDs[1], uuid: testUUIDs[2]
      };
      spyOn(service, 'getFromPath').and.returnValue(rxjs.of(dest));
      spyOn(service, 'getFiles').and.returnValue(rxjs.of([source]));
      const destPath = new Path(['1']);

      service.moveToPath(source, destPath).subscribe(() => {
        fail('moveToPath() with a destination that already exists unexpectedly returned a value');
      }, error => {
        expect(error.message).toEqual('file_already_exists');
      });

      expect(service.getFromPath).toHaveBeenCalledWith(testUUIDs[0], destPath);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], dest.uuid);
    })
  );

  it('#moveToPath() should call #move() with the right parameters if the destination is valid',
    inject([FileService], (service: FileService) => {
      const dest: File = {
        content: '',
        device: testUUIDs[0],
        filename: '1',
        is_directory: true,
        parent_dir_uuid: testUUIDs[5],
        uuid: testUUIDs[1]
      };
      const source: File = {
        content: '',
        device: testUUIDs[0],
        filename: '2',
        is_directory: false,
        parent_dir_uuid: Path.ROOT,
        uuid: testUUIDs[2]
      };
      spyOn(service, 'getFromPath').and.returnValue(rxjs.of(dest));
      spyOn(service, 'getFiles').and.returnValue(rxjs.of([]));
      spyOn(service, 'move').and.returnValue(rxjs.of({ abc: 'def' } as any));
      const destPath = new Path(['1'], testUUIDs[5]);

      service.moveToPath(source, destPath).subscribe(file => {
        expect(file).toEqual({ abc: 'def' } as any);
      }, error => {
        fail(error.message);
      });

      expect(service.getFromPath).toHaveBeenCalledWith(testUUIDs[0], destPath);
      expect(service.getFiles).toHaveBeenCalledWith(testUUIDs[0], dest.uuid);
      expect(service.move).toHaveBeenCalledWith(source.device, source.uuid, dest.uuid, source.filename);
    })
  );

  it('#rename() should call (and return the result of) #move() with the right parameters', inject([FileService], (service: FileService) => {
    const renameFile: File = {
      content: 'abc', device: 'def', filename: 'ghi', is_directory: false, parent_dir_uuid: 'jkl', uuid: 'mno'
    };
    const testResult = rxjs.of({ abc: 'def' }) as any;
    spyOn(service, 'move').and.returnValue(testResult);

    expect(service.rename(renameFile, 'test')).toEqual(testResult);
    expect(service.move).toHaveBeenCalledWith(renameFile.device, renameFile.uuid, renameFile.parent_dir_uuid, 'test');
  }));

  it('#copyFile() should throw an error if the source is a directory', inject([FileService], (service: FileService) => {
    service.copyFile(testFiles[1], new Path([])).subscribe(() => {
      fail('copyFile() unexpectedly returned a value instead of an error');
    }, error => {
      expect(error.message).toEqual('cannot_copy_directory');
    });
  }));

  it('#copyFile() should throw an error if the destination file already exists', inject([FileService], (service: FileService) => {
    spyOn(service, 'getFile').and.callFake(getTestFile);
    spyOn(service, 'getFiles').and.callFake(getTestFiles);

    service.copyFile(testFiles[0], new Path(['0'])).subscribe(() => {
      fail('copyFile() unexpectedly returned a value instead of an error');
    }, error => {
      expect(error.message).toEqual('file_already_exists');
    });
  }));

  it('#copyFile() should copy the source file to the destination using the same name if the destination is a folder',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);
      spyOn(service, 'createFile').and.returnValue(rxjs.of(testFiles[5]));

      service.copyFile(testFiles[0], new Path(['1'])).subscribe(file => {
        expect(service.createFile)
          .toHaveBeenCalledWith(testFiles[0].device, testFiles[0].filename, testFiles[0].content, testFiles[1].uuid);
        expect(file).toEqual(testFiles[5]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#copyFile() should throw an error if the path and the path minus the last part (the parent) do not exist',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.copyFile(testFiles[0], new Path(['1', '2', 'abc321', 'def654'])).subscribe(() => {
        fail('copyFile() unexpectedly returned a value instead of an error');
      }, error => {
        expect(error.message).toEqual('destination_not_found');
      });
    })
  );

  it('#copyFile() should throw an error if the path minus the last part (the parent) is not a directory',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.copyFile(testFiles[0], new Path(['1', '5', 'abc321'])).subscribe(() => {
        fail('copyFile() unexpectedly returned a value instead of an error');
      }, error => {
        expect(error.message).toEqual('destination_not_found');
      });
    })
  );

  it('#copyFile() should throw an error if the destination folder already contains a file ' +
    'with the same file name as the source and the destination is a folder',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);

      service.copyFile(testFiles[3], new Path(['1', '2'])).subscribe(() => {
        fail('copyFile() unexpectedly returned a value instead of an error');
      }, error => {
        expect(error.message).toEqual('file_already_exists');
      });
    })
  );

  it('#copyFile() should copy the source file to the destination folder (path minus last part) ' +
    'with the specified filename (last part of the path) if the path does not already exist',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);
      spyOn(service, 'createFile').and.returnValue(rxjs.of(testFiles[4]));

      service.copyFile(testFiles[5], new Path(['1', '2', 'abc'])).subscribe(file => {
        expect(service.createFile)
          .toHaveBeenCalledWith(testFiles[5].device, 'abc', testFiles[5].content, testFiles[2].uuid);
        expect(file).toEqual(testFiles[4]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#copyFile() should take the parentUUID of the path as the destination folder if the path contains 0 or 1 part',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFile').and.callFake(getTestFile);
      spyOn(service, 'getFiles').and.callFake(getTestFiles);
      spyOn(service, 'createFile').and.returnValue(rxjs.of(testFiles[4]));

      service.copyFile(testFiles[5], new Path([], testFiles[2].uuid)).subscribe(file => {
        expect(service.createFile)
          .toHaveBeenCalledWith(testFiles[5].device, '5', testFiles[5].content, testFiles[2].uuid);
        expect(file).toEqual(testFiles[4]);
      }, error => {
        fail(error.message);
      });

      service.copyFile(testFiles[5], new Path(['abc'], testFiles[2].uuid)).subscribe(file => {
        expect(service.createFile)
          .toHaveBeenCalledWith(testFiles[5].device, 'abc', testFiles[5].content, testFiles[2].uuid);
        expect(file).toEqual(testFiles[4]);
      }, error => {
        fail(error.message);
      });
    })
  );

  it('#copyFile() should redirect error messages other than file_not_found from getFromPath()',
    inject([FileService], (service: FileService) => {
      spyOn(service, 'getFromPath').and.returnValues(
        rxjs.throwError(new Error('test-error')),
        rxjs.throwError(new Error('file_not_found')),
        rxjs.throwError(new Error('test-error'))
      );

      service.copyFile(testFiles[0], new Path(['1', '2'])).subscribe(() => {
        fail('copyFile() unexpectedly returned a value instead of an error');
      }, error => {
        expect(error.message).toEqual('test-error');
      });

      service.copyFile(testFiles[0], new Path(['1', '2'])).subscribe(() => {
        fail('copyFile() unexpectedly returned a value instead of an error');
      }, error => {
        expect(error.message).toEqual('test-error');
      });
    })
  );

});
