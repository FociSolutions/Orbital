import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormControl,
  FormArray,
  AbstractControl,
  Validators
} from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from '../store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { OrbitalAdminService } from '../services/orbital-admin/orbital-admin.service';

@Component({
  selector: 'app-export-to-server-view',
  templateUrl: './export-to-server-view.component.html',
  styleUrls: ['./export-to-server-view.component.scss']
})
export class ExportToServerViewComponent implements OnInit {
  readonly emptyListMessageServerBox = 'No MockDefinitions';
  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;
  inputControl: FormControl;
  exportStatusMessage: string;
  isUploadingMocks: boolean;

  controlsMockDefinitionToString = (control: AbstractControl) =>
    (control.value as MockDefinition).metadata.title

  constructor(
    private location: Location,
    private store: DesignerStore,
    private logger: NGXLogger,
    private service: OrbitalAdminService) {
  }

  ngOnInit() {
    this.inputControl = new FormControl(
      ''
    );

    this.resetForm();
  }

  /**
   * Moves all mock definitions to the left-hand side of the form; clears right-hand side
   */
  private resetForm() {
    this.formArray = new FormArray(
      Array.from(this.store.state.mockDefinitions.values()).map(element => {
        return new FormControl(element, null);
      })
    );
    this.mockDefinitions = [];
  }

  /**
   * The function called on submit. Submits the mock definitions to the server.
   */
  async onSubmit() {
    this.isUploadingMocks = true;
    this.logger.debug('URL contents before uploading', this.inputControl.value);

    const mockDefinitionExportResults = this.exportMocksFromForm();

    let exportStatusSuccess: boolean;
    await Promise.all(mockDefinitionExportResults)
      .then(
        exportStatuses => {
          this.logger.debug(
            'Received response from export to server promise resolution',
            exportStatuses
          );
          exportStatusSuccess = exportStatuses.every(
            exportStatus => exportStatus
          );
        },
        () => {
          exportStatusSuccess = false;
        }
      )
      .finally(() => {
        this.isUploadingMocks = false;
      });

    if (exportStatusSuccess) {
      this.exportStatusMessage = 'File(s) successfully exported';
    } else {
      this.exportStatusMessage = 'File(s) could not be exported because of an error';
    }

    this.resetForm();
  }

  /**
   * Exports the mocks from the form, and returns a list of promises representing the state
   * of the export
   */
  exportMocksFromForm(): Promise<boolean>[] {
    return this.service
      .exportMockDefinitions(
        this.inputControl.value,
        this.formArray.controls.map(formControl => {
          this.logger.debug('Mock definition to export', formControl.value);
          return formControl.value as MockDefinition;
        })
      )
      .map(mockDefinitionExportResult => {
        return mockDefinitionExportResult.toPromise();
      });
  }

  /**
   * Sets the mockDefinitions property equal to the list of MockDefinitions derived from the
   * FormControl values.
   * @param list The list of FormControls given by the shuttle list when the user moves items from
   * one list to the other.
   */
  onListOutput(list: FormControl[]) {
    this.mockDefinitions = list.map(control => control.value);
  }

  /**
   * Getter function that returns true if no Mock Definitions have been selected for
   */
  get disabled(): boolean {
    return this.mockDefinitions.length === 0 || this.isUploadingMocks;
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }

  getSpinnerId() {
    return 'hide-spinner';
  }
}
