import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  constructor(
    private logger: NGXLogger,
    private readfileparser: ReadFileService
  ) {}
  fileName = '';
  @Input() label = '';
  @Input() accept = '';
  errormessages: string[];
  @Output() fileContent = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();

  /**
   * Emits the content of the file as a string
   */
  emitFileContent(file: File) {
    this.errormessages = [];
    this.readfileparser.read(file).subscribe(
      fileReadresult => {
        this.fileName = file.name;
        this.fileNameEmit.emit(this.fileName);
        this.fileContent.emit(fileReadresult);
        this.logger.log('File Contents emitted');
      },
      err => this.errormessages = err
    );
  }

@Input()
  set errorMessage(errorMessage: string[]) {
    this.errormessages = errorMessage || [];
  }

  ngOnInit() {}
}
