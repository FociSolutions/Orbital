import { TestBed, async } from '@angular/core/testing';

import { AddBodyRuleBuilder } from './add-body-rule.builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BrowserModule } from '@angular/platform-browser';

describe('AddBodyRuleBuilderService', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserModule, FormsModule, ReactiveFormsModule, LoggerTestingModule]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: AddBodyRuleBuilder = TestBed.get(AddBodyRuleBuilder);
    expect(service).toBeTruthy();
  });
});
