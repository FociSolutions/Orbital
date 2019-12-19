import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ImportFromServerViewComponent } from './import-from-server-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { DesignerStore } from '../../store/designer-store';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';

describe('ImportFromServerViewComponent', () => {
  let component: ImportFromServerViewComponent;
  let fixture: ComponentFixture<ImportFromServerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFromServerViewComponent],
      imports: [
        MatCardModule,
        RouterTestingModule,
        OrbitalCommonModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ],
      providers: [Location, DesignerStore, MockDefinitionService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromServerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ImportFromServerViewComponent.onBack', () => {
    it('should call location.back()', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.onBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('ImportFromServerViewComponent.onSubmit', () => {
    it('should set the designer stores Mockdefinitions and navigate to the endpoint-view', async () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      const storeSpy = spyOn(TestBed.get(DesignerStore), 'setState');
      const service = TestBed.get(MockDefinitionService);
      service.deserialize(
        JSON.stringify(validMockDefinition)
      ).subscribe({
        next: n => {
          expect(n).toBeTruthy();
        }
      });
      component.mockDefinitions = [validMockDefinition];
      component.onSubmit();

      expect(routerSpy).toHaveBeenCalledWith('endpoint-view');
      expect(storeSpy).toHaveBeenCalled();
    });
  });

  describe('ImportFromServerViewComponent.onListOutput', () => {
    it('should update the list of Mockdefinitions using the values from the list of controls', () => {
      const expectedList = new Array(3).map(
        () => new FormControl(validMockDefinition)
      );
      component.onListOutput(expectedList);
      expect(component.mockDefinitions).toEqual(
        expectedList.map(control => control.value)
      );
    });
  });

  describe('ImportFromServerViewComponent.disabled', () => {
    it('should return true if the Mockdefinitions list is empty', () => {
      expect(component.disabled).toBeTruthy();
    });

    it('should return false if the Mockdefinitions list is not empty', () => {
      component.mockDefinitions = [validMockDefinition];
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('ImportFromServerViewComponent.onResponse', () => {
    it('should set the control value to the response body given an http response with an array body', () => {
      component.onResponse([validMockDefinition]);
      expect(component.formArray.controls[0].value).toEqual(validMockDefinition);
    });

    it('should not set the control value when given a response whose body is null', () => {
      const response = null;
      component.onResponse(response);
      expect(component.formArray.length).toBe(0);
    });
  });
});
