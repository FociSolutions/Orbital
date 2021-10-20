import { TestBed, waitForAsync } from '@angular/core/testing';
import { ValidJsonService } from './valid-json.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import * as faker from 'faker';
import { jsonErrorType } from 'src/app/models/mock-definition/scenario/json-error-type';

describe('ValidJsonService', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: ValidJsonService = TestBed.get(ValidJsonService);
    expect(service).toBeTruthy();
  });

  describe('add-body-rule.checkJSON', () => {
    it('should return EMPTY if the JSON string is empty', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.checkJSON('');
      expect(Actual).toBe(jsonErrorType.EMPTY);
    });
  });

  describe('add-body-rule.checkJSON', () => {
    it('should return EMPTY_JSON if json string parsed is an empty object', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.checkJSON('{}');
      expect(Actual).toBe(jsonErrorType.EMPTY_JSON);
    });
  });

  describe('add-body-rule.checkJSON', () => {
    it('should return INVALID if json cannot be parsed', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.checkJSON('{');
      expect(Actual).toBe(jsonErrorType.INVALID);
    });
  });

  describe('add-body-rule.checkJSON', () => {
    it('should return INVALID if parsed json is not OBJECT', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.checkJSON('test');
      expect(Actual).toBe(jsonErrorType.INVALID);
    });
  });
});
