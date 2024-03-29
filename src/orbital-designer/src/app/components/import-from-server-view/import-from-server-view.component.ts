import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  UntypedFormArray,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observer } from 'rxjs';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss'],
})
export class ImportFromServerViewComponent implements OnInit {
  static readonly urlMaxLength = 2048;
  readonly emptyListMessageServerBox = 'No Mockdefinition(s) ';

  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray | UntypedFormArray;
  requestObserver: Observer<MockDefinition[]>;

  inputControl: FormControl = new FormControl();
  requestInProgress = false;
  title = 'Server URI';

  errors = '';

  controlsMockDefinitionToString = (control: AbstractControl) => control.value.metadata.title;

  @Input() set errorsRestRequest(errors: ValidationErrors | null) {
    this.inputControl?.setErrors(errors);
  }

  constructor(
    private location: Location,
    private logger: NGXLogger,
    private designerStore: DesignerStore,
    private router: Router,
    private orbitalService: OrbitalAdminService
  ) {
    this.formArray = new UntypedFormArray([]);

    this.requestObserver = {
      next: (event) => {
        this.onResponse(event);
        this.errors = '';
      },
      error: () => {
        this.errors = 'File(s) could not be imported because of an error';
        this.requestInProgress = false;
        this.formArray = new UntypedFormArray([]);
      },
      complete: () => (this.requestInProgress = false),
    };
  }

  ngOnInit() {
    this.inputControl = new FormControl(
      '',
      Validators.compose([Validators.maxLength(ImportFromServerViewComponent.urlMaxLength)])
    );
  }

  sendRequestDisabled() {
    return !this.inputControl?.value.length || this.requestInProgress;
  }

  getSpinnerId() {
    return this.requestInProgress ? 'show-spinner' : 'hide-spinner';
  }

  sendRequest() {
    this.inputControl?.markAsDirty();
    if (!this.sendRequestDisabled()) {
      this.requestInProgress = true;
      this.errorsRestRequest = null;
      const url = `${this.inputControl?.value}`;
      this.logger.info('Import From Server: sendRequest(): url:', url);
      this.orbitalService.getAll(url).subscribe(this.requestObserver);
    }
  }

  /**
   * The function called on submit. Sets the Mockdefinitions in the DesignerStore
   */
  onSubmit() {
    for (const mock of this.mockDefinitions) {
      this.designerStore.appendMockDefinition(mock);
      this.designerStore.mockDefinition = mock;
    }
    this.router.navigateByUrl('/endpoint-view');
  }

  /**
   * Sets the Mockdefinitions property equal to the list of MockDefinitions derived from the
   * FormControl values.
   * @param list The list of FormControls given by the shuttle list when the user moves items from
   * one list to the other.
   */
  onListOutput(list: AbstractControl[]) {
    this.mockDefinitions = list.map((control) => control.value);
  }

  /**
   * Getter function that returns true if no Mock Definitions have been selected for
   */
  get disabled(): boolean {
    return this.mockDefinitions.length === 0;
  }

  /**
   * If the response returned is not an error or dom exceptions it sets the controls
   * values to the response body. The control is then responsible for validation.
   * @param response HttpResponse received by the input
   */
  onResponse(response: MockDefinition[]) {
    this.logger.debug('Received http response', response);

    if (response) {
      response.forEach((m) => (m.openApi.tags = m.openApi.tags?.filter((t) => t.name !== 'openapi')));
      this.formArray = new FormArray(response.map((mockDef) => new FormControl(mockDef, null)));

      this.logger.debug('ImportFormServerViewComponent FormArray value:', this.formArray);
    }
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }
}
