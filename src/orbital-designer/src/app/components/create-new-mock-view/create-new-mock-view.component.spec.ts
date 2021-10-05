import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { CreateNewMockViewComponent } from './create-new-mock-view.component';
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
import { FormControl } from '@angular/forms';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';

describe('CreateNewMockViewComponent', () => {
  let component: CreateNewMockViewComponent;
  let fixture: ComponentFixture<CreateNewMockViewComponent>;
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewMockViewComponent],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        RouterTestingModule
      ],
      providers: [Location, DesignerStore, OpenApiSpecService, ReadFileService, MockDefinitionService]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewMockViewComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CreateNewMockViewComponent.goBack', () => {
    it('should return to the previous location', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.goBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('CreateNewMockViewComponent.validateTitle', () => {
    it('should return null if title is valid', () => {
      const formControl: FormControl = new FormControl('ValidTitle');
      expect(component.validateTitle(formControl)).toBeFalsy();
    });
    it('should return error if title is empty', () => {
      const formControl: FormControl = new FormControl('');
      expect(component.validateTitle(formControl)).toEqual({
        key: 'Must enter a title'
      });
    });
    it('should return error if title is just whitespace', () => {
      const formControl: FormControl = new FormControl('   ');
      expect(component.validateTitle(formControl)).toEqual({
        key: 'Title cannot contain only whitespace'
      });
    });
  });

  describe('CreateNewMockViewComponent.formToMockDefinition', () => {
    it('should return a mockdefinition if form is valid', () => {
      const fakeMockDefinition = generateMockDefinitionAndSetForm();
      component.formToMockDefinition().subscribe(value => {
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

  describe('CreateNewMockViewComponent.createMock', () => {
    it('should set the mockDefinition store and route to mock editor', fakeAsync(() => {
      fixture.ngZone.run(() => {
        spyOn(TestBed.get(Router), 'navigateByUrl').and.callFake(route => {
          expect(route).toEqual('/endpoint-view');
        });
        generateMockDefinitionAndSetForm();
        component.createMock();
        tick();
      });
    }));

    it('should not navigate or change designer store state if the formGroup is invalid', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
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

  function generateMockDefinitionAndSetForm(
    title = faker.random.words(3),
    description = faker.random.words(5)
  ): MockDefinition {
    const service = TestBed.get(MockDefinitionService);
    let openApi: OpenAPIV2.Document;
    component.formGroup.setValue({
      ...component.formGroup.value,
      title,
      description
    });
    component.setOpenApiFile(validOpenApiText);
    openApi = yaml.safeLoad(validOpenApiText) as any;
    return {
      metadata: {
        title,
        description
      },
      openApi,
      scenarios: service.getDefaultScenarios(openApi.paths)
    } as MockDefinition;
  }
});
