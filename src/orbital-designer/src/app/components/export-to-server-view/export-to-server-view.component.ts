import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { ExportMockdefinitionService } from 'src/app/services/export-mockdefinition/export-mockdefinition.service';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { every } from 'lodash';
import { OrbitalAdminService } from '../../services/orbital-admin/orbital-admin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-to-server-view',
  templateUrl: './export-to-server-view.component.html',
  styleUrls: ['./export-to-server-view.component.scss'],
})
export class ExportToServerViewComponent implements OnInit {
  readonly emptyListMessageServerBox = 'No Mockdefinitions';
  rightHandSideMocks: MockDefinition[] = [];
  leftHandSideMocks: FormArray;
  inputControl: FormControl;
  exportStatusMessage: string;
  isUploadingMocks: boolean;
  exportErrors: string;

  controlsMockDefinitionToString = (control: AbstractControl) => control.value.metadata.title;

  constructor(
    private location: Location,
    private store: DesignerStore,
    private logger: NGXLogger,
    private mockService: ExportMockdefinitionService,
    private service: OrbitalAdminService
  ) {}

  ngOnInit() {
    this.inputControl = new FormControl('');
    this.inputControl.setValue(environment.apiUrl);

    this.resetForm();
  }

  /**
   * Moves all Mockdefinitions to the left-hand side of the form; clears right-hand side
   */
  private resetForm() {
    const keys = Object.keys(this.store.state.mockDefinitions);
    const controls = keys.map((k) => new FormControl(this.store.state.mockDefinitions[k]));
    this.leftHandSideMocks = new FormArray(controls);
    this.rightHandSideMocks = [];
  }

  /**
   * The function called on submit. Submits the mock definitions to the server.
   */
  async onSubmit() {
    this.isUploadingMocks = true;
    this.exportErrors = '';
    this.exportStatusMessage = '';
    this.logger.debug('URL contents before uploading', this.inputControl.value);

    return this.exportMocksFromForm()
      .pipe(
        finalize(() => {
          this.isUploadingMocks = false;
          this.resetForm();
        })
      )
      .subscribe(
        (uploadMockStatus) => {
          if (every(uploadMockStatus)) {
            this.logger.debug('Received response from export to server promise resolution');
            this.exportStatusMessage = 'File(s) successfully exported';
            this.mockService.urlCache = this.inputControl.value;
          } else {
            this.exportErrors = 'File(s) could not be exported because of an error';
          }
        },
        () => {
          this.exportErrors = 'File(s) could not be exported because of an error';
        }
      );
  }

  /**
   * Exports the mocks from the form, and returns a list of observables representing the state
   * of the export
   */
  exportMocksFromForm(): Observable<boolean[]> {
    this.logger.debug('Mockdefinitions to export', this.rightHandSideMocks);
    return this.service.exportMockDefinitions(this.inputControl.value, this.rightHandSideMocks);
  }

  /**
   * Sets the mockDefinitions property equal to the list of Mockdefinitions derived from the
   * FormControl values.
   * @param list The list of FormControls given by the shuttle list when the user moves items from
   * one list to the other.
   */
  onListOutput(list: FormControl[]) {
    this.rightHandSideMocks = list.map((control) => control.value);
  }

  /**
   * Getter function that returns true if no Mock Definitions have been selected for
   */
  get disabled(): boolean {
    return this.rightHandSideMocks.length === 0 || this.isUploadingMocks;
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
