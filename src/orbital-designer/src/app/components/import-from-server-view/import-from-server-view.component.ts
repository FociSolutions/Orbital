import { Location } from '@angular/common';
import { FormArray, ValidationErrors, AbstractControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { mockDefinitionObjectValidatorFactory } from 'src/app/validators/mock-definition-object-validator/mock-definition-object-validator';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';
import Json from '../../models/json';

import {
  Component,
  OnInit,
  Input,
  Injectable,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpResponse,
  HttpRequest,
  HttpEventType,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observer } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  static readonly urlMaxLength = 2048;
  readonly emptyListMessageServerBox = 'No MockDefinitions';
  readonly invalidMockDefinitionsFoundErrorMessage =
    'One or more invalid Mock Definitions found';

  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;
  requestObserver: Observer<
    HttpEvent<HttpResponse<unknown> | HttpErrorResponse>
  >;
  options: object = {};
  body?: string = null;
  httpMethod = 'GET';
  concatToURI = '';

  protocols: string[] = ['http://', 'https://'];
  selectedProtocol: string = this.protocols[0];
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
    private httpClient: HttpClient,
    private orbitalService: OrbitalAdminService
  ) {
    this.formArray = new FormArray([]);

    this.requestObserver = {
      next: event => {
        if (event.type === HttpEventType.Response) {
          this.onResponse(event);
          this.errors = '';
        }
      },
      error: e => {
        this.errors = e.message;
        this.formArray = new FormArray([]);
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

      this.orbitalService.getAll(`${this.selectedProtocol}${this.inputControl.value}${this.concatToURI}`).subscribe(this.requestObserver);
    }
  }

  /**
   * The function called on submit. Sets the mockDefinitions in the DesignerStore
   */
  onSubmit() {
    this.designerStore.mockDefinitions = this.mockDefinitions.map(
      mockDefinition => this.scenarioObjectsToMap(mockDefinition)
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
  onResponse(
    response: HttpResponse<unknown> | HttpErrorResponse | DOMException
  ) {
    this.logger.debug('Received http response', response);
    if (response instanceof HttpResponse && Array.isArray(response.body)) {
      this.formArray = new FormArray(
        response.body.map(
          obj =>
            new FormControl(obj, null, [
              mockDefinitionObjectValidatorFactory(this.logger)
            ])
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

  /**
   * Converts scenario header and query properties into es6 Maps. Returns the modified MockDefintion
   * @param mockDefinition The mockDefinition to modify
   */
  private scenarioObjectsToMap(mockDefinition: MockDefinition): MockDefinition {
    return {
      ...mockDefinition,
      scenarios: mockDefinition.scenarios.map(s => ({
        ...s,
        response: {
          ...s.response,
          headers: Json.objectToMap(s.response.headers)
        },
        requestMatchRules: {
          headerRules: Json.objectToMap(s.requestMatchRules.headerRules),
          queryRules: Json.objectToMap(s.requestMatchRules.queryRules),
          bodyRules: s.requestMatchRules.bodyRules
        }
      }))
    };
  }
}
