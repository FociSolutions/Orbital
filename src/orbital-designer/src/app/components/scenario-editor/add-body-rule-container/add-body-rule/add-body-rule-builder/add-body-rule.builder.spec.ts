import { TestBed } from '@angular/core/testing';

import { AddBodyRuleBuilder as AddBodyRuleBuilder } from './add-body-rule.builder';

describe('AddBodyRuleBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddBodyRuleBuilder = TestBed.get(AddBodyRuleBuilder);
    expect(service).toBeTruthy();
  });
});
