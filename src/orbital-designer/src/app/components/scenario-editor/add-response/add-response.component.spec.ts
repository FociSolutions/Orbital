import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddResponseComponent } from './add-response.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Response } from '../../../models/mock-definition/scenario/response.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';

describe('AddResponseComponent', () => {
  let component: AddResponseComponent;
  let fixture: ComponentFixture<AddResponseComponent>;
  let jsonService: ValidJsonService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddResponseComponent],
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ],
      providers: [ValidJsonService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseComponent);
    component = fixture.componentInstance;
    jsonService = TestBed.get(ValidJsonService);

    component.response = { headers: new Map<string, string>() } as Response;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addResponse.setStatusCode', () => {
    it('should expect the corresponding status code message in the status field if the status code is valid ', () => {
      component.statusCode = '200';
      expect(component.statusMessage).toEqual('OK');
    });

    it('should expect the corresponding status code message in the status field if the status code is invalid ', () => {
      component.statusCode = '';
      expect(component.statusMessage).toEqual('Enter a Status Code');
    });

    it('should expect the corresponding status code message in the status field if the status code is empty', () => {
      component.statusCode = faker.lorem.words();
      expect(component.statusMessage).toEqual('Invalid Status Code');
    });
  });

  describe('addResponse.saveStatus', () => {
    it('should emit isValid with true and emit the response if save status is true and response is valid', () => {
      const testStatusCode = '200';
      const testHeaderResponse: Map<string, string> = new Map<string, string>();
      const testBodyResponse = '{}';

      testHeaderResponse.set(faker.random.word(), faker.random.word());

      component.childKvpMap = testHeaderResponse;
      component.statusCode = testStatusCode;
      component.bodyResponse = testBodyResponse;

      spyOn(component.isValid, 'emit');
      spyOn(component.responseOutput, 'emit');

      const testResponse = {
        headers: testHeaderResponse,
        body: testBodyResponse,
        status: +testStatusCode
      } as Response;

      component.response = testResponse;
      component.saveStatus = true;

      expect(component.responseOutput.emit).toHaveBeenCalledWith(testResponse);
      expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });

    it('should emit isValid with false if save status is true and response is not valid', () => {
      const testStatusCode = '200';
      const testHeaderResponse: Map<string, string> = new Map<string, string>();
      const testBodyResponse = 'NOTVALID';

      testHeaderResponse.set(faker.random.word(), faker.random.word());

      component.childKvpMap = testHeaderResponse;
      component.statusCode = testStatusCode;
      component.bodyResponse = testBodyResponse;

      spyOn(component.isValid, 'emit');
      spyOn(component.responseOutput, 'emit');

      const testResponse = {
        headers: testHeaderResponse,
        body: testBodyResponse,
        status: +testStatusCode
      } as Response;

      component.response = testResponse;
      component.saveStatus = true;

      expect(component.responseOutput.emit).not.toHaveBeenCalledWith(
        testResponse
      );
      expect(component.isValid.emit).toHaveBeenCalledWith(false);
    });

    it('should emit isValid with true if save status is false', () => {
      spyOn(component.isValid, 'emit');
      component.saveStatus = false;

      expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });
  });
});
