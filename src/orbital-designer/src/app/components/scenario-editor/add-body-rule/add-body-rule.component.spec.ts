import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { AddBodyRuleComponent } from './add-body-rule.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('AddBodyRuleComponent', () => {
  let component: AddBodyRuleComponent;
  let fixture: ComponentFixture<AddBodyRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBodyRuleComponent],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        LoggerTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
