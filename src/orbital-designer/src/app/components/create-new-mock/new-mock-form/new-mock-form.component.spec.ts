import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { OpenAPIV2 } from 'openapi-types';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NewMockFormComponent } from './new-mock-form.component';
import { MockDefinitionStore } from '../../../store/mockdefinitionstore';
import { FileParserService } from 'src/app/services/file-parser.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { EndpointsStore } from 'src/app/store/endpoints-store';

describe('NewMockFormComponent', () => {
  let component: NewMockFormComponent;
  let fixture: ComponentFixture<NewMockFormComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewMockFormComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [MockDefinitionStore, FileParserService, EndpointsStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMockFormComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show an error when a valid Open Api Spec file is uploaded', async () => {
    const file = new File([''], 'fake-file');
    const fakeDocument = { basePath: '', host: '' } as OpenAPIV2.Document;
    const fileParserSpy = spyOn(
      TestBed.get(FileParserService),
      'readOpenApiSpec'
    ).and.returnValue(new Promise(resolve => resolve(fakeDocument)));
    const mockDefStoreSpy = spyOn(
      TestBed.get(MockDefinitionStore),
      'updateApiInformation'
    );
    const endpointStoreSpy = spyOn(TestBed.get(EndpointsStore), 'setEndpoints');
    await component.onFileChange({
      0: file,
      length: 1,
      item: (index: number) => file
    });
    fixture.detectChanges();
    const errorMessage = element.query(By.css('.d-block.invalid-feedback'));
    expect(errorMessage.nativeElement.style.visibility).toMatch('hidden');
    expect(component.showError).toBeFalsy();
  });

  it('should show an error when an invalid Open Api Spec file is uploaded', async () => {
    const file = new File([''], 'fake-file');
    const fileParserSpy = spyOn(
      TestBed.get(FileParserService),
      'readOpenApiSpec'
    ).and.returnValue(new Promise((resolve, reject) => reject()));
    await component.onFileChange({
      0: file,
      length: 1,
      item: (index: number) => file
    });
    fixture.detectChanges();
    const errorMessage = element.query(By.css('.d-block.invalid-feedback'));
    expect(errorMessage.nativeElement.style.visibility).toMatch('visible');
    expect(component.showError).toBeTruthy();
  });

  it('should set the file name to display when a file is uploaded', async () => {
    const file = new File([''], 'fake-file');
    await component.onFileChange({
      0: file,
      length: 1,
      item: (index: number) => file
    });
    fixture.detectChanges();
    const fileName = element.query(By.css('.custom-file-label')).nativeElement
      .innerText;
    expect(fileName).toMatch(file.name);
    expect(component.fileName).toBe(file.name);
  });

  it('should update metadata information at the component level when title is changed', () => {
    const title = faker.random.words();
    component.onMockNameChange(title);
    expect(component.metaData.title).toBe(title);
  });

  it('should update metadata information at the component level when description is changed', () => {
    const description = faker.random.words();
    component.onDescriptionChange(description);
    expect(component.metaData.description).toBe(description);
  });

  it('should update the metadata information in the MockDefinitionStore when submitted', () => {
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    const storeSpy = spyOn(
      TestBed.get(MockDefinitionStore),
      'updateMetadata'
    ).and.callThrough();
    component.metaData = {
      title: faker.random.word(),
      description: faker.random.words()
    };
    component.onFormSubmit();
    expect(storeSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalled();
  });
});
