import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetadataComponent } from './add-metadata.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { SharedModule } from '../../../shared/shared.module';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import * as faker from 'faker';

describe('AddMetadataComponent', () => {
  let component: AddMetadataComponent;
  let fixture: ComponentFixture<AddMetadataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMetadataComponent],
      imports: [
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        SharedModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatCheckboxModule,
        LoggerTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AddMetadataComponent', () => {
    it('should set the setter', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: 'test title',
        description: 'test description',
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;

      expect(component.metadataTitle).toBe('test title');
      expect(component.metadataDescription).toBe('test description');
    });
  });

  describe('AddMetadataComponent.validate', () => {
    it('should show an error if the title field is empty', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: '',
        description: faker.random.words(10).substring(0, 49),
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.validate();
      expect(component.titleErrorMessage).toBeTruthy();
    });

    it('should not show an error if the title field is not empty and less than max length', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: faker.random.words(5).substring(0, 49),
        description: faker.random.word().substring(0, 49),
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.validate();
      expect(component.titleErrorMessage).toBeFalsy();
    });

    it('should show an error if the title field is more than or equal to max length', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: 'Z'.repeat(51),
        description: faker.random.word(),
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.validate();
      expect(component.titleErrorMessage).toBeTruthy();
    });

    it('should show an error if the description field is more than or equal to max length', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: faker.random.words(10).substring(0, 49),
        description: 'Z'.repeat(501),
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.validate();
      expect(component.descriptionErrorMessage).toBeTruthy();
    });

    it('should not show an error if the description field is empty', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: faker.random.words(10).substring(0, 49),
        description: '',
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.validate();
      expect(component.descriptionErrorMessage).toBeFalsy();
    });

    it('should not show an error if the description field is undefined', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: faker.random.words(10).substring(0, 49),
        description: undefined,
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.validate();
      expect(component.descriptionErrorMessage).toBeFalsy();
    });
  });

  describe('AddMetadataComponent.saveStatus setter', () => {
    it('should emit the metadata when saved', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: faker.random.words(10).substring(0, 49),
        description: faker.random.words(10).substring(0, 49),
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;

      const spy = jest.spyOn(component.metadataOutput, 'emit');
      component.saveStatus = true;
      expect(spy).toHaveBeenCalledWith(testMockDef.metadata);
      spy.mockRestore();
    });

    it('should not emit the metadata when not saved', () => {
      const testMockDef = {
        metadata: {
          title: 'New Scenario',
          description: '',
        },
      } as MockDefinition;
      testMockDef.metadata = {
        title: faker.random.words(10).substring(0, 49),
        description: faker.random.words(10).substring(0, 49),
      } as unknown as Metadata;
      component.metadata = testMockDef.metadata;

      const spy = jest.spyOn(component.metadataOutput, 'emit');
      component.saveStatus = false;
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
