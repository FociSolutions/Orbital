import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';
import { map, catchError } from 'rxjs/operators';

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
  @Input() errormessage ? = '';
  @Output() fileContent = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();

  /**
   * Emits the content of the file as a string
   */
  emitFileContent(file: File) {
    this.readfileparser.read(file).subscribe(
      fileReadresult => {
        this.fileNameEmit.emit(this.fileName);
        this.fileContent.emit(fileReadresult);
        this.logger.log('File Contents emmited');
      },
      err => this.errormessage = err
    );
  }

  ngOnInit() {}
}
