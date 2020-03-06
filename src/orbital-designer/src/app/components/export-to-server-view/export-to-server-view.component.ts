import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormArray, AbstractControl } from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { ExportMockdefinitionService } from 'src/app/services/export-mockdefinition/export-mockdefinition.service';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { every } from 'lodash';
import { OrbitalAdminService } from '../../services/orbital-admin/orbital-admin.service';

@Component({
  selector: 'app-export-to-server-view',
  templateUrl: './export-to-server-view.component.html',
  styleUrls: ['./export-to-server-view.component.scss']
})
export class ExportToServerViewComponent implements OnInit {
  readonly emptyListMessageServerBox = 'No Mockdefinitions';
  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;
  inputControl: FormControl;
  exportStatusMessage: string;
  isUploadingMocks: boolean;

  controlsMockDefinitionToString = (control: AbstractControl) => (control.value as MockDefinition).metadata.title;

  constructor(
    private location: Location,
    private store: DesignerStore,
    private logger: NGXLogger,
    private mockService: ExportMockdefinitionService,
    private service: OrbitalAdminService
  ) {}

  ngOnInit() {
    this.inputControl = new FormControl('');

    this.resetForm();
  }

  /**
   * Moves all Mockdefinitions to the left-hand side of the form; clears right-hand side
   */
  private resetForm() {
    const keys = Object.keys(this.store.state.mockDefinitions);
    const controls = keys.map(k => new FormControl(this.store.state.mockDefinitions[k]));
    this.formArray = new FormArray(controls);
    this.mockDefinitions = [];
  }

  /**
   * The function called on submit. Submits the mock definitions to the server.
   */
  async onSubmit() {
    this.isUploadingMocks = true;
    this.logger.debug('URL contents before uploading', this.inputControl.value);

    return this.exportMocksFromForm()
      .pipe(
        finalize(() => {
          this.isUploadingMocks = false;
          this.resetForm();
        })
      )
      .subscribe(
        uploadMockStatus => {
          if (every(uploadMockStatus)) {
            this.logger.debug('Received response from export to server promise resolution');
            this.exportStatusMessage = 'File(s) successfully exported';
            this.mockService.urlCache = this.inputControl.value;
          } else {
            this.exportStatusMessage = 'File(s) could not be exported because of an error';
          }
        },
        () => {
          this.exportStatusMessage = 'File(s) could not be exported because of an error';
        }
      );
  }

  /**
   * Exports the mocks from the form, and returns a list of observables representing the state
   * of the export
   */
  exportMocksFromForm(): Observable<boolean[]> {
    return this.service.exportMockDefinitions(
      this.inputControl.value,
      this.formArray.controls.map(formControl => {
        this.logger.debug('Mockdefinition to export', formControl.value);
        return formControl.value as MockDefinition;
      })
    );
  }

  /**
   * Sets the mockDefinitions property equal to the list of Mockdefinitions derived from the
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
