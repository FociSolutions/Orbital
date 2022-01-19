import { TestBed } from '@angular/core/testing';

import { AddBodyRuleBuilder } from './add-body-rule.builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BrowserModule } from '@angular/platform-browser';

describe('AddBodyRuleBuilderService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserModule, FormsModule, ReactiveFormsModule, LoggerTestingModule],
    }).compileComponents();
  });

  it('should be created', () => {
    const service: AddBodyRuleBuilder = TestBed.inject(AddBodyRuleBuilder);
    expect(service).toBeTruthy();
  });
});
