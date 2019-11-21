import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddResponseComponent } from './add-response.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Response } from '../../../models/mock-definition/scenario/response.model';

describe('AddResponseComponent', () => {
  let component: AddResponseComponent;
  let fixture: ComponentFixture<AddResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddResponseComponent],
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseComponent);
    component = fixture.componentInstance;
    component.response = { headers: new Map<string, string>() } as Response;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addResponse.setStatusCode', () => {
    it('should expect the corresponding status code message in the status field if the status code is valid ', () => {
      component.statusCode = 200;
      expect(component.isStatusCodeValid).toBeTruthy();
    });

    it('should expect the corresponding status code message in the status field if the status code is invalid', () => {
      component.statusCode = faker.lorem.words();
      expect(component.isStatusCodeValid).toBeFalsy();
    });
  });

  describe('addResponse.saveStatus', () => {
    it('should emit the response if the user wants to save', () => {
      const testStatusCode = 200;
      const testHeaderResponse: Map<string, string> = new Map<string, string>();
      const testBodyResponse = 'NOTVALID';

      testHeaderResponse.set(faker.random.word(), faker.random.word());

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
    });
  });

  describe('addResponse.saveHeaderMap', () => {
    it('should emit the response if the status code and body is valid', () => {
      component.statusCode = 200;
      component.isBodyValid = true;
      component.bodyResponse = '{}';

      const headerMap = new Map<string, string>();
      headerMap.set(faker.random.word(), faker.random.word());
      const saveHeaderMapSpy = spyOn(component.responseOutput, 'emit');
      component.saveHeaderMap(headerMap);

      expect(saveHeaderMapSpy).toHaveBeenCalledWith(({
        headers: headerMap,
        body: component.bodyResponse,
        status: +component.statusCode
      } as unknown) as Response);
    });
  });
});
