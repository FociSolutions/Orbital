import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetadataComponent } from './add-metadata.component';
import { MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatCardModule, MatIconModule, MatDividerModule, MatCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';

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
        FormsModule,
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
});
