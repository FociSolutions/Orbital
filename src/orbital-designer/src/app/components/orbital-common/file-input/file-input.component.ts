import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  constructor(
    private logger: NGXLogger,

  ){}
  fileName = '';
  @Input() label = '';
  @Input() accept = '';
  @Input() errormessage ? = '';
  @Output() fileContent = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();

  /**
   * Emmits the content of the file as a string
   */
  emitFileContent(file: File) {


    this.fileNameEmit.emit(this.fileName);
    this.fileContent.emit(file as string);
    this.logger.log('File Contents emmited');
  }

  ngOnInit() {}
}
