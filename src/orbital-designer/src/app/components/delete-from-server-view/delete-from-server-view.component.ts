import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Observer } from 'rxjs';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

@Component({
  selector: 'app-delete-from-server-view',
  templateUrl: './delete-from-server-view.component.html',
  styleUrls: ['./delete-from-server-view.component.scss'],
})
export class DeleteFromServerViewComponent implements OnInit {
  @Input() set errorsRestRequest(errors: ValidationErrors | null) {
    if (this.inputControl) {
      this.inputControl.setErrors(errors);
    }
  }

  constructor(
    private location: Location,
    private logger: NGXLogger,
    private orbitalService: OrbitalAdminService,
    private notificationService: NotificationService
  ) {
    this.formArray = new FormArray([]);

    this.requestObserver = {
      next: (event) => {
        this.onResponse(event);
        this.statusMessage = '';
      },
      error: () => {
        this.errorMessage = 'Mock(s) could not be viewed because of an error';
        this.notificationService.open('Mock(s) could not be viewed because of an error');
        this.requestInProgress = false;
        this.clearForm();
      },
      complete: () => (this.requestInProgress = false),
    };
  }

  /**
   * Getter function that returns true if no Mock Definitions have been selected for
   */
  get disabled(): boolean {
    return this.mockDefinitions.length === 0 || this.requestInProgress || this.deleteInProgress;
  }
  static readonly urlMaxLength = 2048;
  readonly emptyListMessageServerBox = 'No Mockdefinition(s) ';

  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;
  requestObserver: Observer<MockDefinition[]>;

  concatToURI = '';

  inputControl: FormControl | null = null;
  requestInProgress = false;
  title = 'Server URI';

  statusMessage = '';
  errorMessage = '';
  deleteInProgress = false;
  triggerOpenConfirmBox = false;

  controlsMockDefinitionToString = (control: AbstractControl) => control.value.metadata.title;

  ngOnInit() {
    this.inputControl = new FormControl(
      '',
      Validators.compose([Validators.maxLength(DeleteFromServerViewComponent.urlMaxLength)])
    );
  }

  sendRequestDisabled() {
    return this.inputControl?.value.length === 0 || this.requestInProgress || this.deleteInProgress;
  }

  getSpinnerId() {
    return this.requestInProgress ? 'show-spinner' : 'hide-spinner';
  }

  sendRequest() {
    this.statusMessage = '';
    this.errorMessage = '';
    this.inputControl?.markAsDirty();
    if (this.sendRequestDisabled()) {
      this.requestInProgress = true;
      this.errorsRestRequest = null;

      this.orbitalService.getAll(`${this.inputControl?.value}${this.concatToURI}`).subscribe(this.requestObserver);
    }
  }

  /**
   * The function called on submit; deletes the Mockdefinitions when pressed.
   */
  onSubmit() {
    this.deleteInProgress = true;
    this.orbitalService
      .deleteMockDefinitions(
        `${this.inputControl?.value}${this.concatToURI}`,
        this.mockDefinitions.map((mockDefinition) => mockDefinition.metadata.title)
      )
      .pipe(
        finalize(() => {
          this.deleteInProgress = false;
        })
      )
      .subscribe({
        next: (deleteMockStatus) => {
          if (deleteMockStatus.every((mockDeletedSuccessfully) => mockDeletedSuccessfully)) {
            this.logger.debug('Received response from export to server promise resolution');
            this.statusMessage = 'Mock(s) successfully deleted';
            this.clearRightHandSide();
          } else {
            this.errorMessage = 'Mock(s) could not be deleted because of an error';
            this.logger.debug('Mock deletion statuses', deleteMockStatus);
          }
        },
        error: (error) => {
          this.logger.error('Mock(s) could not be deleted because of an error', error);
          this.notificationService.open('Mock(s) could not be deleted because of an error');
        },
      });
  }

  /**
   * Sets the Mockdefinitions property equal to the list of MockDefinitions derived from the
   * FormControl values.
   * @param list The list of FormControls given by the shuttle list when the user moves items from
   * one list to the other.
   */
  onListOutput(list: FormControl[]) {
    this.mockDefinitions = list.map((control) => control.value);
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

      this.logger.debug('DeleteFromServerViewComponent FormArray value:', this.formArray);
    }
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }

  /**
   * Moves all Mockdefinitions to the left-hand side of the form; clears right-hand side
   */
  private clearRightHandSide() {
    const chosenMocks = this.formArray.controls
      .filter(
        (mock) =>
          !this.mockDefinitions.map((rightHandMock) => rightHandMock.metadata.title).includes(mock.value.metadata.title)
      )
      .map((aMock) => aMock.value);
    this.formArray = new FormArray(chosenMocks.map((mockDef) => new FormControl(mockDef, null)));
    this.mockDefinitions = [];
  }

  /**
   * Clears all Mockdefinitions from the form
   */
  private clearForm() {
    this.formArray = new FormArray([]);
    this.mockDefinitions = [];
  }

  /**
   * Opens the confirmation box when attempting to delete Mockdefinitions from the server
   */
  triggerOpenConfirmationBox() {
    this.triggerOpenConfirmBox = true;
  }

  /**
   * Performs the server Mockdefinition deletion if the user confirms
   * @param choice The boolean value of the user's choice for the popup
   */
  onConfirmDialogAction(choice: boolean) {
    this.triggerOpenConfirmBox = false;
    if (choice) {
      this.onSubmit();
    }
  }
}
