import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-import-from-file-view',
  templateUrl: './import-from-file-view.component.html',
  styleUrls: ['./import-from-file-view.component.scss']
})
export class ImportFromFileViewComponent implements OnInit {
  private router: Router;
  private location: Location;
  private mockDefinitionString: string;
  mockDefinitionNameString: string;
  private mockDefinitionService: MockDefinitionService;
  constructor(
    router: Router,
    location: Location,
    mockDefinitionService: MockDefinitionService,
    private logger: NGXLogger
  ) {
    this.router = router;
    this.location = location;
    this.mockDefinitionService = mockDefinitionService;
  }

  isValid() {
    return !!this.mockDefinitionString;
  }

  setMockDefinition(fileStringFromFileInput: string) {
    this.mockDefinitionString = fileStringFromFileInput;
  }
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
            this.logger.log('mock deifinition was saved to the store');
            this.router.navigateByUrl('endpoint-view');
        }
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
