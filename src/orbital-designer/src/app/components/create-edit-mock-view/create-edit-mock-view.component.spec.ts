import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { CreateEditMockViewComponent } from './create-edit-mock-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import validOpenApiText from '../../../test-files/valid-openapi-spec';
import * as faker from 'faker';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
import { OpenAPIV2 } from 'openapi-types';
import { EMPTY } from 'rxjs';
import * as yaml from 'js-yaml';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import * as uuid from 'uuid';
import { recordMap } from 'src/app/models/record';

describe('CreateEditMockViewComponent', () => {
  let component: CreateEditMockViewComponent;
  let fixture: ComponentFixture<CreateEditMockViewComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditMockViewComponent],
      imports: [OrbitalCommonModule, MatCardModule, BrowserAnimationsModule, LoggerTestingModule, RouterTestingModule],
      providers: [Location, DesignerStore, OpenApiSpecService, ReadFileService, MockDefinitionService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditMockViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CreateEditMockViewComponent.goBack', () => {
    it('should return to the previous location', () => {
      const locationSpy = jest.spyOn(TestBed.get(Location), 'back');
      component.goBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('CreateEditMockViewComponent.validateText', () => {
    it('should return null if title is valid', () => {
      const title = component.formGroup.get('title');
      title.setValue('test');
      expect(title.errors).toBeFalsy();
    });
    it('should return error if title is empty', () => {
      const title = component.formGroup.get('title');
      title.setValue('');
      expect(title.errors).toEqual({
        key: 'Title is required.',
      });
    });
    it('should return error if title is just whitespace', () => {
      const title = component.formGroup.get('title');
      title.setValue(' ');
      expect(title.errors).toEqual({
        key: 'Title cannot contain only whitespace',
      });
    });

    it('should return error if it is a title and has a title that already exists', () => {
      const title = component.formGroup.get('title');
      component.titleList.push('myMockTest');
      title.setValue('myMockTest');
      expect(title.errors).toEqual({
        key: 'Title already exists.',
      });
    });
  });

  describe('CreateEditMockViewComponent.formToMockDefinition', () => {
    it('should return a mock definition if form is valid', () => {
      const fakeMockDefinition = generateMockDefinitionAndSetForm();
      component.formToMockDefinition().subscribe((value) => {
        expect(value.openApi).toEqual(fakeMockDefinition.openApi);
        expect(value.metadata).toEqual(fakeMockDefinition.metadata);
        expect(value.host).toEqual(fakeMockDefinition.host);
        expect(value.basePath).toEqual(fakeMockDefinition.basePath);
        expect(value.scenarios[0].metadata).toEqual(fakeMockDefinition.scenarios[0].metadata);
        expect(value.scenarios[0].requestMatchRules).toEqual(fakeMockDefinition.scenarios[0].requestMatchRules);
        expect(value.scenarios[0].response).toEqual(fakeMockDefinition.scenarios[0].response);
      });
    });
    it('should return EMPTY if form is invalid', () => {
      generateMockDefinitionAndSetForm();
      component.formGroup.setErrors({ incorrect: true });
      const mockDefinition = component.formToMockDefinition();
      expect(mockDefinition).toEqual(EMPTY);
    });
  });

  describe('CreateEditMockViewComponent.createMock', () => {
    it('should set the mockDefinition store and route to mock editor', fakeAsync(() => {
      fixture.ngZone.run(() => {
        jest.spyOn(TestBed.get(Router), 'navigateByUrl').mockImplementation((route) => {
          expect(route).toEqual('/endpoint-view');
        });
        generateMockDefinitionAndSetForm();
        component.createMock();
        tick();
      });
    }));

    it('should not navigate or change designer store state if the formGroup is invalid', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const routerSpy = jest.spyOn(TestBed.get(Router), 'navigateByUrl');
        generateMockDefinitionAndSetForm();
        fixture.detectChanges();
        component.formGroup.setErrors({ incorrect: true });
        component.createMock();
        fixture.detectChanges();
        tick();
        expect(routerSpy).not.toHaveBeenCalled();
      });
    }));
  });

  describe('CreateEditMockViewComponent Edit methods', () => {
    let selectedMockDef: MockDefinition;
    let store: DesignerStore;

    beforeEach(() => {
      component.editMode = true;
      store = TestBed.get(DesignerStore);

      selectedMockDef = generateMockDefinitionAndSetForm();
      store.appendMockDefinition(selectedMockDef);
    });

    it('should update the mock based on values in the form', () => {
      const newTitle = faker.random.words(2);
      const newDesc = faker.random.words(5);
      const newValidate = false;

      component.formGroup.setValue({
        ...component.formGroup.value,
        title: newTitle,
        description: newDesc,
        validateToken: newValidate,
      });

      const updatedMock = component.formToUpdateMockDefinition(selectedMockDef);
      expect(updatedMock.metadata.title).toEqual(newTitle);
      expect(updatedMock.metadata.description).toEqual(newDesc);
      expect(updatedMock.tokenValidation).toEqual(newValidate);
    });

    it('should find the mockdef in the store', () => {
      const mockId = selectedMockDef.id;
      expect(
        component.findSelectedMock(
          mockId,
          recordMap(store.state.mockDefinitions, (md) => md)
        )
      ).toEqual(selectedMockDef);
    });
  });

  function generateMockDefinitionAndSetForm(
    title = faker.random.words(3),
    description = faker.random.words(5),
    validateToken = true
  ): MockDefinition {
    const service = TestBed.get(MockDefinitionService);
    const openApi: OpenAPIV2.Document = yaml.load(validOpenApiText) as OpenAPIV2.Document;
    component.formGroup.setValue({
      ...component.formGroup.value,
      title,
      description,
      validateToken,
    });
    component.setOpenApiFile(validOpenApiText);
    return {
      id: uuid.v4(),
      metadata: {
        title,
        description,
      },
      tokenValidation: validateToken,
      openApi,
      scenarios: service.getDefaultScenarios(openApi.paths),
    };
  }
});
