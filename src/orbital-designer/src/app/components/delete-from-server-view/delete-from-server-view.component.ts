import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observer } from 'rxjs';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-delete-from-server-view',
  templateUrl: './delete-from-server-view.component.html',
  styleUrls: ['./delete-from-server-view.component.scss']
})
export class DeleteFromServerViewComponent implements OnInit {
  static readonly urlMaxLength = 2048;
  readonly emptyListMessageServerBox = 'No Mockdefinition(s) ';


  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;
  requestObserver: Observer<MockDefinition[]>;
  options: object = {};
  body?: string = null;

  concatToURI = '';

  inputControl: FormControl;
  requestInProgress = false;
  title = 'Server URI';

  errors: string;

  controlsMockDefinitionToString = (control: AbstractControl) => (control.value as MockDefinition).metadata.title;

  @Input() set errorsRestRequest(errors: object) {
    if (!!this.inputControl) {
      this.inputControl.setErrors(errors);
    }
  }

  constructor(
    private location: Location,
    private logger: NGXLogger,
    private orbitalService: OrbitalAdminService
  ) {
    this.formArray = new FormArray([]);

    this.requestObserver = {
      next: event => {
        this.onResponse(event);
        this.errors = '';
      },
      error: () => {
        this.errors = 'File(s) could not be deleted because of an error';
        this.requestInProgress = false;
      },
      complete: () => (this.requestInProgress = false)
    };
  }

  ngOnInit() {
    this.inputControl = new FormControl(
      '',
      Validators.compose([Validators.maxLength(DeleteFromServerViewComponent.urlMaxLength)])
    );
  }

  sendRequestDisabled() {
    return this.inputControl.value.length === 0 || this.requestInProgress;
  }

  getSpinnerId() {
    return this.requestInProgress ? 'show-spinner' : 'hide-spinner';
  }

  sendRequest() {
    this.inputControl.markAsDirty();
    if (this.sendRequestDisabled) {
      this.requestInProgress = true;
      this.errorsRestRequest = null;

      this.orbitalService.getAll(`${this.inputControl.value}${this.concatToURI}`).subscribe(this.requestObserver);
    }
  }

  /**
   * The function called on submit; deletes the Mockdefinitions when pressed.
   */
  onSubmit() {
    // delete Mockdefinitions here
  }

  /**
   * Sets the Mockdefinitions property equal to the list of MockDefinitions derived from the
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
    return this.mockDefinitions.length === 0;
  }

  /**
   * If the response returned is not an error or domexceptions it sets the controls
   * values to the response body. The control is then responsible for validation.
   * @param response HttpResponse received by the input
   */
  onResponse(response: MockDefinition[]) {
    this.logger.debug('Received http response', response);

    if (!!response) {
      response.forEach(m => (m.openApi.tags = m.openApi.tags.filter(t => t.name !== 'openapi')));
      this.formArray = new FormArray(response.map(mockDef => new FormControl(mockDef, null)));

      this.logger.debug('DeleteFromServerViewComponent FormArray value:', this.formArray);
    }
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }
}
