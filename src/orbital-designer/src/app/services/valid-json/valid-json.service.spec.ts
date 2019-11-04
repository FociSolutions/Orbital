import { TestBed } from '@angular/core/testing';

import { ValidJsonService } from './valid-json.service';

describe('ValidJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidJsonService = TestBed.get(ValidJsonService);
    expect(service).toBeTruthy();
  });
});

describe('add-body-rule.isValidJSON', () => {
  it('should return false if the JSON cannot be parsed ', () => {
    const service: ValidJsonService = TestBed.get(ValidJsonService);
    const Actual = service.isValidJSON('invalid');
    expect(Actual).toBe(false);
  });
});

describe('add-body-rule.tryParseJSON', () => {
  it('should return null if the JSON cannot be parsed ', () => {
    const service: ValidJsonService = TestBed.get(ValidJsonService);
    const Actual = service.tryParseJSON('invalid');
    expect(Actual).toBe(null);
  });
});
