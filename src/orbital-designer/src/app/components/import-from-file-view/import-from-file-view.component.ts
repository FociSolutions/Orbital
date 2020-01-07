import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

@Component({
  selector: 'app-import-from-file-view',
  templateUrl: './import-from-file-view.component.html',
  styleUrls: ['./import-from-file-view.component.scss']
})
export class ImportFromFileViewComponent implements OnInit {
  private mockDefinitionString: string;
  mockDefinitionNameString: string;
  validFileFlag = false;
  errorMessageToEmitFromCreate: string[];

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
  async validateMock(mockDefinitionString: string) {
    MockDefinition.toMockDefinitionAsync(mockDefinitionString).then(
      () => this.validFileFlag = true,
      () => this.validFileFlag = false
    );
  }

  /**
   * Sets the string represantation of the file's content from the input-file component.
   *
   * @param fileStringFromFileInput string representation of the file's content
   */
  setMockDefinition(fileStringFromFileInput: string) {
    this.mockDefinitionString = fileStringFromFileInput;

    this.validateMock(fileStringFromFileInput);
  }

  /**
   * Sets the file name in the component. This value is emited from the input-file component.
   *
   * @param fileStringName string representation of the file's name
   */
  setMockDefinitionName(fileStringName: string) {
    this.mockDefinitionNameString = fileStringName;
  }

  /**
   * createMock is a function that is responsible for storing the new MockDefinition
   * in the designer store and navigating to the mock editor if the form is valid. If
   * the form is invalid the function does nothing.
   */
 createMock() {
    const observable = this.mockDefinitionService.deserialize(this.mockDefinitionString).pipe(map(
        value => value
      ));
    observable.subscribe(
      value => {
        if (value) {
            this.logger.log('mock definition was saved to the store');
            this.router.navigateByUrl('endpoint-view');
        }
      },
      error => {
        this.logger.log('mock definition is invalid and was not saved to the store');
        this.errorMessageToEmitFromCreate = error;
        this.validFileFlag = false;
      }
    );

  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  ngOnInit() {}
}
