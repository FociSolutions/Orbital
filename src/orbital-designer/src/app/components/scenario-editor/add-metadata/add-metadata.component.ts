import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.scss']
})
export class AddMetadataComponent implements OnInit {
  @Input() saveStatus: boolean;

  @Output() metadataOutput: EventEmitter<Metadata>;
  @Output() isValid: EventEmitter<boolean>;

  metadataTitle = '';
  metadataDescription = '';

  constructor() {
    this.isValid = new EventEmitter<boolean>();
    this.metadataOutput = new EventEmitter<Metadata>();
  }

  ngOnInit() {
  }

  @Input() set(metadata: Metadata) {
    this.metadataTitle = metadata.title;
    this.metadataDescription = metadata.description;
  }

}
