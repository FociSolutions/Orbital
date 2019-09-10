import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { CreateNewMockViewComponent } from './create-new-mock-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import validOpenApiText from '../../../test-files/valid-openapi-spec';
import * as faker from 'faker';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { FileParserService } from 'src/app/services/file-parser.service';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';

describe('CreateNewMockViewComponent', () => {
  let component: CreateNewMockViewComponent;
  let fixture: ComponentFixture<CreateNewMockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewMockViewComponent],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [Location, FileParserService, DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMockViewComponent);
    component = fixture.componentInstance;
    component.formGroup.addControl('testControl', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CreateNewMockViewComponent.errorMessages', () => {
    it('should output the correct error message', () => {
      const errors = {
        required: true,
        maxlength: true,
        custom: 'Custom error message'
      };
      component.formGroup.controls.testControl.setErrors(errors);
      const Expected = [
        'testControl is required',
        'Max characters exceeded',
        'Custom error message'
      ];
      expect(component.errorMessages('testControl')).toEqual(Expected);
    });

    it('should return an empty list if there are no errors', () => {
      expect(component.errorMessages('testControl')).toEqual([]);
    });
  });

  describe('CreateNewMockViewComponent.goBack', () => {
    it('should return to the previous location', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.goBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('CreateNewMockViewComponent.formToMockDefinition', () => {
    it('should return a mockdefinition if form is valid', async () => {
      const mockTitle = faker.random.word();
      const mockDescription = faker.random.words();
      const openApi = await MockDefinition.toOpenApiSpec(validOpenApiText);
      component.formGroup.setValue({
        ...component.formGroup.value,
        title: mockTitle,
        description: mockDescription,
        openApiFile: new File([validOpenApiText], 'test-file.yml')
      });
      const mockDefinition = await component.formToMockDefinition();
      expect(mockDefinition).toBeTruthy();
      expect(mockDefinition.metadata).toEqual({
        title: mockTitle,
        description: mockDescription
      });
      expect(mockDefinition.openApi).toEqual(openApi);
      expect(mockDefinition.host).toEqual(openApi.host);
      expect(mockDefinition.basePath).toEqual(openApi.basePath);
    });

    it('should return null if form is invalid', async () => {
      const mockTitle = faker.random.word();
      const mockDescription = faker.random.words();
      component.formGroup.setValue({
        ...component.formGroup.value,
        title: mockTitle,
        description: mockDescription,
        openApiFile: new File([validOpenApiText], 'test-file.yml')
      });
      component.formGroup.setErrors({ incorarect: true });
      const mockDefinition = await component.formToMockDefinition();
      expect(mockDefinition).toBeFalsy();
    });
  });

  describe('CreateNewMockViewComponent.createMock', () => {
    it('should set the mockDefinition store and route to mock editor', async () => {
      const mockTitle = faker.random.word();
      const mockDescription = faker.random.words();
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      const storeSpy = spyOn(TestBed.get(DesignerStore), 'setState');
      component.formGroup.setValue({
        ...component.formGroup.value,
        title: mockTitle,
        description: mockDescription,
        openApiFile: new File([validOpenApiText], 'test-file.yml')
      });
      await component.createMock();
      expect(storeSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith('mock-editor');
    });

    it('should not navigate or change designer store state if the formGroup is invalid', async () => {
      const mockTitle = faker.random.word();
      const mockDescription = faker.random.words();
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      const storeSpy = spyOn(TestBed.get(DesignerStore), 'setState');
      component.formGroup.setValue({
        ...component.formGroup.value,
        title: mockTitle,
        description: mockDescription,
        openApiFile: new File([validOpenApiText], 'test-file.yml')
      });
      component.formGroup.setErrors({ incorrect: true });
      await component.createMock();
      expect(routerSpy).not.toHaveBeenCalled();
      expect(storeSpy).not.toHaveBeenCalled();
    });
  });
});
