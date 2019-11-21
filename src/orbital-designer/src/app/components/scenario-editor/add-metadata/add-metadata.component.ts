import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterContentChecked,
  ChangeDetectorRef
} from '@angular/core';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.scss']
})
export class AddMetadataComponent implements OnInit, AfterContentChecked {
  @Output() metadataOutput: EventEmitter<Metadata>;

  metadataTitleProp: string;
  metadataDescriptionProp: string;

  titleErrorMessage: string;
  descriptionErrorMessage: string;

  isCardDisabled: boolean;
  panelExpanded: boolean;

  constructor(private logger: NGXLogger, private cdRef: ChangeDetectorRef) {
    this.metadataOutput = new EventEmitter<Metadata>();
    this.metadataTitleProp = '';
    this.metadataDescriptionProp = '';
    this.titleErrorMessage = '';
    this.descriptionErrorMessage = '';
  }

  ngOnInit() {}

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Sets the metadata title
   */
  @Input()
  set metadataTitle(metadataTitle: string) {
    if (metadataTitle !== undefined) {
      this.logger.debug('Set the metadata title', metadataTitle);
      this.metadataTitleProp = metadataTitle.trim();
      this.validate();
    }
  }

  /**
   * Gets the metadata title
   */
  get metadataTitle() {
    return this.metadataTitleProp;
  }

  /**
   * Sets the metadata description
   */
  @Input()
  set metadataDescription(metadataDescription: string) {
    if (metadataDescription !== undefined) {
      this.logger.debug('Set the metadata description', metadataDescription);
      this.metadataDescriptionProp = metadataDescription;
      this.validateDescription();
    }
  }

  /**
   * Gets the metadata description
   */
  get metadataDescription() {
    return this.metadataDescriptionProp;
  }

  /**
   * Sets the metadata
   * @param metadata The metadata to set
   */
  @Input()
  set metadata(metadata: Metadata) {
    if (!!metadata) {
      this.metadataTitle = metadata.title;
      this.metadataDescription = metadata.description;
    }
  }

  /**
   * Emits the form validity and the metadata output when the form is saved
   */
  @Input()
  set saveStatus(shouldSave: boolean) {
    if (shouldSave && this.titleErrorMessage.length < 1) {
      if (this.metadataTitleProp && this.metadataTitleProp.length > 0) {
        const metadataToOutput = {
          title: this.metadataTitle,
          description: this.metadataDescription
        } as Metadata;
        this.logger.debug(
          'AddMetadataComponent:saveStatus: Emit metadata',
          metadataToOutput
        );
        this.metadataOutput.emit(metadataToOutput);
      } else {
        this.validate();
      }
    }
  }

  /**
   * Checks if the form is valid (title is required)
   */
  validate() {
    this.validateTitle();
    this.validateDescription();
    this.checkStatus();
  }

  private validateDescription() {
    if (
      !!this.metadataDescriptionProp &&
      this.metadataDescriptionProp.length > 500
    ) {
      this.logger.debug(
        'AddMetadataComponent:validateDescription: Description is longer than 500 characters'
      );
      this.descriptionErrorMessage =
        'Metadata description can only be 500 characters long';
    } else {
      this.descriptionErrorMessage = '';
    }
  }

  private validateTitle() {
    if (!this.metadataTitleProp || this.metadataTitleProp.length === 0) {
      this.logger.debug(
        'AddMetadataComponent:validateTitle: Title is null or empty'
      );
      this.titleErrorMessage = 'Metadata title is required';
    } else if (this.metadataTitleProp.length > 50) {
      this.logger.debug(
        'AddMetadataComponent:validateTitle: Title is longer than 50 characters'
      );
      this.titleErrorMessage =
        'Metadata title max length exceeded (50 characters)';
    } else {
      this.titleErrorMessage = '';
    }
  }
  /**
   * Check if current response is valid or not.
   * If not valid, call disable card; otherwise, enable expansion
   */
  private checkStatus() {
    if (this.titleErrorMessage.length < 1) {
      this.isCardDisabled = false;
    } else {
      this.disableCard();
    }
  }
  /**
   * Disable and expand the card
   */
  private disableCard() {
    this.logger.debug(
      'AddMetadataComponent:disableCard: Disable and expand card'
    );
    this.isCardDisabled = true;
    this.panelExpanded = true;
  }
}
