import { Location } from '@angular/common';
import { FormArray, AbstractControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';
import Json from '../../models/json';

import {
  Component,
  OnInit,
  Input} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observer } from 'rxjs';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  static readonly urlMaxLength = 2048;
  readonly emptyListMessageServerBox = 'No Mockdefinition(s) ';
  readonly invalidMockDefinitionsFoundErrorMessage =
    'One or more invalid Mockdefinition(s) found';

  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;
  requestObserver: Observer<MockDefinition[]>;
  options: object = {};
  body?: string = null;
  httpMethod = 'GET';
  concatToURI = '';

  inputControl: FormControl;
  requestInProgress = false;
  title = 'Server URI';
  buttonName = 'Submit';
  errors: string;

  controlsMockDefinitionToString = (control: AbstractControl) =>
    (control.value as MockDefinition).metadata.title

  @Input() set errorsRestRequest(errors: object) {
    if (!!this.inputControl) {
      this.inputControl.setErrors(errors);
    }
  }

  constructor(
    private location: Location,
    private logger: NGXLogger,
    private designerStore: DesignerStore,
    private router: Router,
    private orbitalService: OrbitalAdminService
  ) {
    this.formArray = new FormArray([]);

    this.requestObserver = {
      next: event => {
        this.onResponse(event);
        this.errors = '';
      },
      error: () => {
        this.errors = 'File(s) could not be imported because of an error';
        this.requestInProgress = false;
      },
      complete: () => (this.requestInProgress = false)
    };
  }

  ngOnInit() {
    this.inputControl = new FormControl(
      '',
      Validators.compose([
        Validators.maxLength(ImportFromServerViewComponent.urlMaxLength)
      ])
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

      this.orbitalService
        .getAll(
          `${this.inputControl.value}${this.concatToURI}`
        )
        .subscribe(this.requestObserver);
    }
  }

  /**
   * The function called on submit. Sets the mockDefinitions in the DesignerStore
   */
  onSubmit() {
    this.designerStore.mockDefinitions = this.mockDefinitions.map(
      mockDefinition => MockDefinition.objectToMockDefinition(mockDefinition)
    );
    this.router.navigateByUrl('endpoint-view');
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
      this.formArray = new FormArray(
        response.map(
          mockDef =>
            new FormControl(mockDef, null)
        )
      );

      this.logger.debug(
        'ImportFormServerViewComponent FormArray value:',
        this.formArray
      );
    }
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }
}
