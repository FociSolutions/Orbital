import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-import-from-file-view',
  templateUrl: './import-from-file-view.component.html',
  styleUrls: ['./import-from-file-view.component.scss'],
})
export class ImportFromFileViewComponent {
  private mockDefinitionString: string[] = [];
  mockdefinitionValid: string[] = [];
  mockdefinitionInvalid: string[] = [];
  mockDefinitionNameString: string[] = [];
  errorMessageToEmitFromCreate: Record<string, string[]> = {};
  validFileFlag = true;
  buttonDisabled = true;
  tempName = '';

  constructor(
    private router: Router,
    private location: Location,
    private mockDefinitionService: MockDefinitionService,
    private logger: NGXLogger
  ) {}

  isValid() {
    return this.validFileFlag;
  }

  /**
   * Validates the Mockdefinition and returns a boolean validation status
   */
  async validateMock(mockDefinitionString: string, index: number) {
    this.logger.log(`validateMock ${mockDefinitionString}`);
    this.mockDefinitionService.validateMockDefinition(mockDefinitionString).subscribe(
      (value) => {
        if (value) {
          this.logger.log('mock definition file selected is valid');
          this.validFileFlag = true;
          this.mockdefinitionValid.push(this.tempName);
          if (this.mockdefinitionInvalid.length > 0) {
            this.buttonDisabled = true;
            this.validFileFlag = false;
          } else {
            this.buttonDisabled = false;
          }
        }
      },
      (error) => {
        this.logger.error('mock definition is invalid and was not saved to the store');
        this.errorMessageToEmitFromCreate[this.mockDefinitionNameString[index]] = [error.message];
        this.validFileFlag = false;
        this.buttonDisabled = true;
        this.mockdefinitionInvalid.push(this.tempName);
      }
    );
  }

  /**
   * Sets the string representation of the file's content from the input-file component.
   *
   * @param fileStringFromFileInput string representation of the file's content
   */
  setMockDefinition(fileStringFromFileInput: string) {
    this.mockDefinitionString.push(fileStringFromFileInput);
    const index = this.mockDefinitionString.length - 1;
    this.validateMock(fileStringFromFileInput, index);
  }

  /**
   * Sets the file name in the component. This value is emitted from the input-file component.
   *
   * @param fileStringName string representation of the file's name
   */
  setMockDefinitionName(fileStringName: string) {
    this.mockDefinitionNameString.push(fileStringName);
    this.tempName = fileStringName;
  }

  /**
   * This function checks if the emitted value is valid and that
   * elements in the mockDefinitionNameString exist, then clears
   * the collections for the next use of the form.
   *
   * @param x emitted value
   */
  checkEmit(x: boolean) {
    if (this.mockDefinitionNameString.length > 0 && x) {
      this.errorMessageToEmitFromCreate = {};
      this.clearArrays();
    }
  }

  /**
   * createMock is a function that is responsible for storing the new MockDefinition
   * in the designer store and navigating to the mock editor if the form is valid. If
   * the form is invalid the function does nothing.
   */
  createMock() {
    this.mockDefinitionString.forEach((mock, index) => {
      this.mockDefinitionService
        .AddMockDefinitionToStore(mock)
        .pipe(map((value) => value))
        .subscribe(
          (value) => {
            if (value) {
              this.logger.log('mock definition was saved to the store');
              this.router.navigateByUrl('endpoint-view');
            }
          },
          (error) => {
            this.logger.error('mock definition is invalid and was not saved to the store');
            this.errorMessageToEmitFromCreate[this.mockDefinitionNameString[index]] = [error.message];
          }
        );
    });
  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  /**
   * Clears the local arrays
   */
  clearArrays() {
    this.mockDefinitionNameString = [];
    this.mockDefinitionString = [];
    this.mockdefinitionInvalid = [];
    this.mockdefinitionValid = [];
  }
}
