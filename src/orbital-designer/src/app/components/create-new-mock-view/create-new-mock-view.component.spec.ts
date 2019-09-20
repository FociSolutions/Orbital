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
import { FileParserService } from 'src/app/services/file-parser/file-parser.service';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';
import { LoggerTestingModule } from 'ngx-logger/testing';

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
        LoggerTestingModule,
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

  describe('CreateNewMockViewComponent.goBack', () => {
    it('should return to the previous location', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.goBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('CreateNewMockViewComponent.formToMockDefinition', () => {
    it('should return a mockdefinition if form is valid', async () => {
      const fakeMockDefinition = await generateMockDefinitionAndSetForm();
      const mockDefinition = await component.formToMockDefinition();
      expect(mockDefinition).toBeTruthy();
      expect(mockDefinition).toEqual(fakeMockDefinition);
    });

    it('should return null if form is invalid', async () => {
      await generateMockDefinitionAndSetForm();
      component.formGroup.setErrors({ incorrect: true });
      const mockDefinition = await component.formToMockDefinition();
      expect(mockDefinition).toBeFalsy();
    });
  });

  describe('CreateNewMockViewComponent.createMock', () => {
    it('should set the mockDefinition store and route to mock editor', async () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      const storeSpy = spyOn(TestBed.get(DesignerStore), 'setState');
      await generateMockDefinitionAndSetForm();
      await component.createMock();
      expect(storeSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith('endpoint-view');
    });

    it('should not navigate or change designer store state if the formGroup is invalid', async () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      const storeSpy = spyOn(TestBed.get(DesignerStore), 'setState');
      await generateMockDefinitionAndSetForm();
      component.formGroup.setErrors({ incorrect: true });
      await component.createMock();
      expect(routerSpy).not.toHaveBeenCalled();
      expect(storeSpy).not.toHaveBeenCalled();
    });
  });

  async function generateMockDefinitionAndSetForm(
    title = faker.random.word(),
    description = faker.random.words()
  ): Promise<MockDefinition> {
    const openApi = await MockDefinition.toOpenApiSpec(validOpenApiText);
    component.formGroup.setValue({
      ...component.formGroup.value,
      title,
      description,
      openApiFile: new File([validOpenApiText], 'test-file.yml')
    });

    return {
      metadata: {
        title,
        description
      },
      host: openApi.host,
      basePath: openApi.basePath,
      openApi,
      scenarios: []
    } as MockDefinition;
  }
});
