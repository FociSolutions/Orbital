import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.scss']
})
export class AddMetadataComponent implements OnInit {
  @Input() saveStatus: boolean;

  @Output() metadataOutput: EventEmitter<Metadata>;
  @Output() isValid: EventEmitter<boolean>;

  metadataTitleProp = '';
  metadataDescriptionProp = '';

  errorMessage = '';

  constructor(private logger: NGXLogger) {
    this.isValid = new EventEmitter<boolean>();
    this.metadataOutput = new EventEmitter<Metadata>();
  }

  ngOnInit() {
  }

  /**
   * Sets the metadata title
   */
  set metadataTitle(metadataTitle: string) {
    this.validate();
    this.logger.debug('Set the metadata title', metadataTitle);
    this.metadataTitleProp = metadataTitle;
  }

  /**
   * Gets the metadata title
   */
  @Input()
  get metadataTitle() {
    return this.metadataTitleProp;
  }

  /**
   * Sets the metadata description
   */
  set metadataDescription(metadataDescription: string) {
    this.validate();
    this.logger.debug('Set the metadata description', metadataDescription);
    this.metadataDescriptionProp = metadataDescription;
  }

  /**
   * Gets the metadata description
   */
  @Input()
  get metadataDescription() {
    return this.metadataDescriptionProp;
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
  validate() {
    this.logger.debug('Called validation for metadata card entry point');
    if (!this.metadataTitle || this.metadataTitle.length === 0) {
      this.errorMessage = 'Metadata title is required';
    } else if (!this.metadataTitle || this.metadataTitle.length > 50) {
      this.errorMessage = 'Metadata title max length exceeded (50 characters)';
    } else if (!this.metadataDescription || this.metadataDescription.length > 500) {
      this.errorMessage = 'Metadata description can only be 500 characters long';
    } else {
      this.errorMessage = '';
      return false;
    }

    this.logger.debug('Called validation for metadata card', this.errorMessage);
  }

  /**
   * Checks if the metadata field has an error
   */
  metadataHasError() {
    return this.errorMessage.length === 0;
  }
}
