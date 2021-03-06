import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddResponseComponent } from './add-response.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Response } from '../../../models/mock-definition/scenario/response.model';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';

describe('AddResponseComponent', () => {
  let component: AddResponseComponent;
  let fixture: ComponentFixture<AddResponseComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [AddResponseComponent],
      imports: [OrbitalCommonModule, BrowserAnimationsModule, LoggerTestingModule],
      providers: [ScenarioFormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(AddResponseComponent);
    component = fixture.componentInstance;
    component.response = { headers: {} } as Response;
    const scenarioBuilder = TestBed.get(ScenarioFormBuilder);
    component.responseFormGroup = scenarioBuilder.responseFormGroup(emptyScenario.response);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addResponse.setStatusCode', () => {
    it('should expect the corresponding status code message in the status field if the status code is valid ', () => {
      component.statusCode = 200;
      expect(component.responseFormGroup.controls.status.valid).toBeTruthy();
    });

    it('should expect the corresponding status code message in the status field if the status code is invalid', () => {
      component.statusCode = -1;
      expect(component.responseFormGroup.controls.status.valid).toBeFalsy();
    });
  });

  describe('addResponse.saveStatus', () => {
    it('should emit the response if the user wants to save', () => {
      const testStatusCode = 200;
      const testHeaderResponse: Record<string, string> = {};
      const testBodyResponse = 'NOTVALID';

      testHeaderResponse[faker.random.word()] = faker.random.word();

      component.statusCode = testStatusCode;
      component.responseFormGroup.controls.body.setValue(testBodyResponse);

      spyOn(component.isValid, 'emit');
      spyOn(component.responseOutput, 'emit');

      const testResponse = {
        headers: testHeaderResponse,
        body: testBodyResponse,
        status: +testStatusCode
      } as Response;

      component.response = testResponse;
      component.saveStatus = true;

      expect(component.responseOutput.emit).not.toHaveBeenCalledWith(testResponse);
    });
  });

  describe('addResponse.saveHeaderRecord', () => {
    it('should emit the response if the status code and body is valid', () => {
      component.statusCode = 200;
      component.responseFormGroup.controls.body.setValue('{}');

      const headerRecord = {};
      headerRecord[faker.random.word()] = faker.random.word();
      const saveHeaderRecordSpy = spyOn(component.responseOutput, 'emit');
      component.saveHeaders(headerRecord);

      expect(saveHeaderRecordSpy).toHaveBeenCalledWith(({
        headers: headerRecord,
        body: component.responseFormGroup.controls.body.value,
        status: +component.statusCode
      } as unknown) as Response);
    });
  });
});
