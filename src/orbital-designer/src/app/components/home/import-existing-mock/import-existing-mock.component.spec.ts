import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { ImportExistingMockComponent } from './import-existing-mock.component';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { FileParserService } from 'src/app/services/file-parser.service';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

describe('ImportExistingMockComponent', () => {
  let component: ImportExistingMockComponent;
  let fixture: ComponentFixture<ImportExistingMockComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExistingMockComponent ],
      imports: [ RouterTestingModule.withRoutes([]) ],
      providers: [
        MockDefinitionStore,
        FileParserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExistingMockComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read valid mock file and store a MockDefinition representation', async () => {
    const fakeMockDefinition: MockDefinition = {
      basePath: faker.internet.domainSuffix(),
      host: faker.internet.domainName(),
      metadata: {
        title: faker.random.word(),
        description: faker.random.words()
      },
      openApi: faker.random.words(),
      scenarios: []
    };
    const file = new File([''], 'testFile');
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    const storeSpy = spyOn(TestBed.get(MockDefinitionStore), 'setState').and.callThrough();
    const fileParserSpy = spyOn(TestBed.get(FileParserService), 'readMockDefinition')
      .and.returnValue(
        new Promise<MockDefinition>(
          (resolve) => resolve(fakeMockDefinition)
        )
      );
    await component.onFileInput({0: file, length: 1, item: (index: number) => file});
    fixture.detectChanges();
    expect(fileParserSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalled();
    expect(component.showError).toBeFalsy();
    const errorMessage = element.query(By.css('.d-block.invalid-feedback'));
    expect(errorMessage.nativeElement.style.visibility).toMatch('hidden');
  });

  it('should read an invalid mock file show an error message', async () => {
    const file = new File([''], 'testFile');
    const fileParserSpy = spyOn(TestBed.get(FileParserService), 'readMockDefinition')
      .and.callThrough();
    await component.onFileInput({0: file, length: 1, item: (index: number) => file});
    fixture.detectChanges();
    expect(fileParserSpy).toHaveBeenCalled();
    expect(component.showError).toBeTruthy();
    const errorMessage = element.query(By.css('.d-block.invalid-feedback'));
    expect(errorMessage.nativeElement.style.visibility).toMatch('visible');
  });

  it('should set file name after uploading an input file', async () => {
    const file = new File([''], 'testFile');
    await component.onFileInput({0: file, length: 1, item: (index: number) => file});
    fixture.detectChanges();
    const fileName = element.query(By.css('.custom-file-label')).nativeElement.innerText;
    expect(fileName).toMatch(file.name);
    expect(component.fileName).toBe(file.name);
  });
});
