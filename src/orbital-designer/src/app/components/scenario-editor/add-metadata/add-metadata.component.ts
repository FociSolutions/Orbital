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

  /**
   * Sets the metadata
   * @param metadata The metadata to set
   */
  @Input()
  set metadata(metadata: Metadata) {
    this.metadataTitle = metadata.title;
    this.metadataDescription = metadata.description;
  }

  /**
   * Checks if the form is valid (title is required)
   */
  isFormValid() {
    return this.metadataTitle.length && this.metadataTitle.length <= 50 && this.metadataDescription.length <= 500;
  }
}
