import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResponseComponent } from './add-response.component';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatIconModule,
  MatDividerModule,
  MatCheckboxModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/public_api';

describe('AddResponseComponent', () => {
  let component: AddResponseComponent;
  let fixture: ComponentFixture<AddResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddResponseComponent],
      imports: [
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
