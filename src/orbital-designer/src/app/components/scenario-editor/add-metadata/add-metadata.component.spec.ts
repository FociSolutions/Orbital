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
        MatCheckboxModule]
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
});
