import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { FileService } from '../../../api/files/file.service';
import { Path } from '../../../api/files/path';
import { SafeHtml } from '@angular/platform-browser';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends WindowComponent implements OnInit {

  @ViewChild('editorTextfield', { static: true }) editorTextfield: ElementRef;

  editorHtml: SafeHtml;

  constructor(private fileService: FileService) {
    super();
  }

  ngOnInit() {
  }

  enter(inputPath: string) {
    console.log(inputPath);
    let path: Path;
    try {
      path = Path.fromString(inputPath);
    } catch {
      console.log('The specified path is not valid');
      return;
    }

    this.fileService.getFromPath(JSON.parse(sessionStorage.getItem('activeDevice')).uuid, path).subscribe(file => {
      if (file.is_directory) {
        console.log('That is not a file');
      } else {
        // TODO
        console.log(file.content);
        this.editorHtml = file.content;
      }
    }, error => {
      if (error.message === 'file_not_found') {
        console.log('That file does not exist');
      } else {
        console.log(error);
      }
    });
  }
}

export class EditorWindowDelegate extends WindowDelegate {
  title = 'Editor';
  icon = 'assets/desktop/img/editor.svg';
  type: Type<any> = EditorComponent;

  constraints = new WindowConstraints({ minWidth: 300, minHeight: 200 });
}
