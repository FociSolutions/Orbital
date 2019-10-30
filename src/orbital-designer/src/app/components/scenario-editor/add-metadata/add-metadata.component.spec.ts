import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetadataComponent } from './add-metadata.component';
import { MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatCardModule, MatIconModule, MatDividerModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BrowserModule } from '@angular/platform-browser';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import * as faker from 'faker';

describe('AddMetadataComponent', () => {
  let component: AddMetadataComponent;
  let fixture: ComponentFixture<AddMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMetadataComponent ],
      imports: [MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatCheckboxModule,
        LoggerTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AddMetadataComponent', () => {
    it('should set the setter', () => {
      const testMockDef = new MockDefinition();
      testMockDef.metadata = {title: 'test title', description: 'test description'} as unknown as Metadata;
      component.metadata = testMockDef.metadata;

      expect(component.metadataTitle).toBe('test title');
      expect(component.metadataDescription).toBe('test description');
    });
  });

  describe('AddMetadataComponent.getErrorMessage', () => {
    it('should show an error if the title field is empty', () => {
      const testMockDef = new MockDefinition();
      testMockDef.metadata = {title: '', description: faker.random.word()} as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.getErrorMessage();
      expect(component.errorMessage).toBe('Metadata title is required');
    });

    it('should not show an error if the title field is not empty and less than max length', () => {
      const testMockDef = new MockDefinition();
      testMockDef.metadata = {title: faker.random.word(), description: faker.random.word()} as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.getErrorMessage();
      expect(component.errorMessage).toBe('');
    });

    it('should show an error if the title field is more than or equal to max length', () => {
      const testMockDef = new MockDefinition();
      testMockDef.metadata = {title: 'Z'.repeat(51), description: faker.random.word()} as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.getErrorMessage();
      expect(component.errorMessage).toBe('Metadata title max length exceeded (50 characters)');
    });

    it('should show an error if the description field is more than or equal to max length', () => {
      const testMockDef = new MockDefinition();
      testMockDef.metadata = {title: faker.random.word(), description: 'Z'.repeat(501)} as unknown as Metadata;
      component.metadata = testMockDef.metadata;
      component.getErrorMessage();
      expect(component.errorMessage).toBe('Metadata description can only be 500 characters long');
    });
  });
});
