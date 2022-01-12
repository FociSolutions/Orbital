import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as HttpStatus from 'http-status-codes';
import { Response } from '../../../models/mock-definition/scenario/response.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { NGXLogger } from 'ngx-logger';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { jsonErrorType } from 'src/app/models/mock-definition/scenario/json-error-type';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss'],
})
export class AddResponseComponent implements OnInit, AfterContentChecked {
  @Output() responseOutput: EventEmitter<Response>;
  @Output() isValid: EventEmitter<boolean>;
  @Input() responseFormGroup: FormGroup;

  @ViewChild('editor', { static: false }) editor: JsonEditorComponent;

  headers: Record<string, string> = {};

  /**
   * The error message for the body response
   */
  bodyErrorMessage: string;

  /**
   *  The status message for the corresponding code
   */
  statusMessage: string;

  /**
   * The titles for the kvp edit component
   */
  titleForKvp: string;
  titleForKvpAdded: string;

  isCardDisabled: boolean;
  shouldSave: boolean;

  shadowType: FormControl = new FormControl();

  options: JsonEditorOptions;
  bodyData: unknown;

  constructor(private jsonService: ValidJsonService, private logger: NGXLogger, private cdRef: ChangeDetectorRef) {
    this.responseOutput = new EventEmitter<Response>();
    this.isValid = new EventEmitter<boolean>();
    this.titleForKvp = 'Add New Header Rule';
    this.titleForKvpAdded = 'Added Header Rules';
    this.bodyErrorMessage = 'Body Content not in Valid JSON Format';
    this.statusMessage = 'Enter a Status Code';

    this.options = new JsonEditorOptions();
    this.options.mode = 'code';
    this.options.modes = ['code', 'text'];
    this.options.statusBar = true;
    this.options.onChange = () => this.changeLog();
  }

  ngOnInit() {
    this.checkBody();
    this.updateStatusCodeDescription();

    this.shadowType.setValue(this.responseFormGroup.controls.type.value === ResponseType.TEMPLATED);

    this.responseFormGroup.controls.status.valueChanges.subscribe(() => {
      this.updateStatusCodeDescription();
    });
  }

  /**
   * Checks & handles incoming JSON body for erroneous input
   */
  checkBody() {
    try {
      this.bodyData = JSON.parse(this.responseFormGroup.controls.body.value);
    } catch (e) {
      this.bodyData = {};
    }
  }

  /**
   * Handler method for any changes to json-editor content
   */
  changeLog() {
    const jsonEditorString = this.editor.getText();
    const errorType = this.getErrorType(jsonEditorString);
    if (errorType != jsonErrorType.NONE && errorType != jsonErrorType.EMPTY_JSON) {
      this.setError(`Response body${this.jsonService.jsonErrorMap.get(errorType)}`);
    } else {
      this.responseFormGroup.controls.body.setValue(jsonEditorString);
    }
  }

  /**
   * Sets or clears JSON body error footer based on supplied boolean flag
   * @param flag Set/clear flag
   */
  setError(message: string) {
    this.responseFormGroup.controls.body.setErrors({ invalidJson: message });
  }

  /**
   *
   * @param jsonEditorString the json editor input
   * @returns the error type enum
   */
  getErrorType(jsonEditorString: string): jsonErrorType {
    return this.jsonService.checkJSON(jsonEditorString);
  }

  /**
   * Updates the status code's description (e.g. "OK" for 200)
   */
  private updateStatusCodeDescription() {
    const newStatus = this.responseFormGroup.controls.status.value;
    if (newStatus) {
      try {
        this.statusMessage = HttpStatus.getStatusText(Number(newStatus));
        this.responseFormGroup.controls.status.setErrors(null);
      } catch (Error) {
        this.statusMessage = 'Enter a Status Code';
        this.responseFormGroup.controls.status.setErrors({ invalidStatusCode: 'Status code not valid' });
      }
    }
  }

  ngAfterContentChecked(): void {
    this.checkStatus();
    this.cdRef.detectChanges();
  }

  /**
   * If shouldSave is true, validate the response and emit to the parent as well as the isValid boolean
   */
  @Input()
  set saveStatus(save: boolean) {
    this.shouldSave = save;
  }

  @Input()
  set response(newResponse: Response) {
    if (newResponse) {
      this.headers = newResponse.headers;
    }
  }

  /**
   * Gets the status code
   */
  get statusCode(): number {
    return this.responseFormGroup.controls.status.value;
  }

  /**
   * Sets the status code
   */
  set statusCode(newStatus: number) {
    this.responseFormGroup.controls.status.setValue(newStatus);
  }

  /**
   * Wait for header KVP , then trigger emitter if current response is valid
   * @param map Response KVP
   */
  saveHeaders(map: Record<string, string>) {
    const type = this.shadowType.value ? ResponseType.TEMPLATED : ResponseType.CUSTOM;
    this.responseFormGroup.controls.type.setValue(type);

    if (this.responseFormGroup.valid) {
      const responseToEmit: Response = {
        headers: map,
        body: this.responseFormGroup.controls.body.value,
        status: +this.responseFormGroup.controls.status.value,
        type: ResponseType.NONE,
      };
      this.logger.debug('AddResponseComponent:saveHeaders: Response has been emitted', responseToEmit);
      this.responseOutput.emit(responseToEmit);
    } else {
      this.disableCard();
    }
  }

  /**
   * Check if current response is valid or not.
   * If not valid, call disable card; otherwise, enable expansion
   */
  private checkStatus() {
    if (this.responseFormGroup.valid) {
      this.isCardDisabled = false;
    } else {
      this.disableCard();
    }
  }

  /**
   * Disable and expand the card
   */
  private disableCard() {
    this.isCardDisabled = true;
  }
}
