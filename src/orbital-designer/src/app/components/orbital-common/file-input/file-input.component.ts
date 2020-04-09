import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';
import { map } from 'rxjs/operators';
import { recordAdd, recordFirstOrDefaultKey, recordFirstOrDefault } from 'src/app/models/record';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  constructor(private logger: NGXLogger, private readfileparser: ReadFileService) {}
  fileName: string[] = [];
  currentFileName: string;
  fileContent: string;
  @Input() label = '';
  @Input() accept = '';
  @Input() multiple = true;
  errormessages = {} as Record<string, string>;
  @Output() fileContentEmit = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();

  /**
   * Emits the contents of the files as strings
   */
  emitFileContent(files: File[]) {
    for (const file of files) {
      this.readfileparser
        .read(file)
        .pipe(map(fileReadresult => fileReadresult))
        .subscribe(
          fileReadresult => {
            this.fileName.push(file.name);
            this.currentFileName = file.name;
            this.fileContent = fileReadresult;
            this.fileNameEmit.emit(this.currentFileName);
            this.fileContentEmit.emit(this.fileContent);
          },
          err => recordAdd(this.errormessages, file.name, err)
        );
    }
    this.logger.log('File Contents emitted');
  }

  set errorMessage(errorMessage: Record<string, string>) {
    recordAdd(this.errormessages, recordFirstOrDefaultKey(errorMessage, ''), recordFirstOrDefault(errorMessage, ''));
    if (this.errormessages) {
      this.fileName.pop();
    }
  }

  ngOnInit() {}
}
