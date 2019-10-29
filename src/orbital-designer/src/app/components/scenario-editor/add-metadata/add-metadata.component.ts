import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.scss']
})
export class AddMetadataComponent implements OnInit {
  @Input() metadata: Metadata;
  @Input() saveStatus: boolean;

  @Output() metadataOutput: EventEmitter<Metadata>;
  @Output() isValid: EventEmitter<boolean>;

  metadataTitle = '';
  metadataDescription = '';

  constructor() {
    this.isValid = new EventEmitter<boolean>();
    this.metadataOutput = new EventEmitter<Metadata>();

    this.metadataTitle = !!this.metadata ? this.metadata.title : '';
    this.metadataDescription = !!this.metadata ? this.metadata.description : '';
  }

  ngOnInit() {
  }

}
