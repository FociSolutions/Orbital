import { TestBed, async } from '@angular/core/testing';

import { AddBodyRuleBuilder } from './add-body-rule.builder';
import { FormControl, FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BrowserModule } from '@angular/platform-browser';

describe('AddBodyRuleBuilderService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserModule, FormsModule, ReactiveFormsModule, LoggerTestingModule]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: AddBodyRuleBuilder = TestBed.get(AddBodyRuleBuilder);
    expect(service).toBeTruthy();
  });

  it('should return false for a valid JSON path', () => {
    const service: AddBodyRuleBuilder = TestBed.get(AddBodyRuleBuilder);
    expect(service.validateJsonPath(new FormControl('$....'))).toEqual({
      invalidJsonPath: true,
      message: 'The JSON path is invalid'
    });
  });

  it('should return true for a valid JSON path', () => {
    const service: AddBodyRuleBuilder = TestBed.get(AddBodyRuleBuilder);
    expect(service.validateJsonPath(new FormControl('$..z'))).toBe(null);
  });
});
