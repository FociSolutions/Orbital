import { TestBed, async } from '@angular/core/testing';
import { ValidJsonService } from './valid-json.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

describe('ValidJsonService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidJsonService = TestBed.get(ValidJsonService);
    expect(service).toBeTruthy();
  });

  describe('add-body-rule.isValidJSON', () => {
    it('should return false if the JSON cannot be parsed ', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.isValidJSON('invalid');
      expect(Actual).toBe(false);
    });
  });

  describe('add-body-rule.isValidJSON', () => {
    it('should return true if the JSON can be parsed ', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.isValidJSON('{}');
      expect(Actual).toBe(true);
    });
  });

  describe('add-body-rule.parseJSONOrDefault', () => {
    it('should return default value if the JSON cannot be parsed ', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.parseJSONOrDefault<string>('Invalid JSON', '{}');
      expect(Actual).toBe('{}');
    });
  });
  describe('add-body-rule.parseJSONOrDefault', () => {
    it('should return the JSON object value if the JSON can be parsed ', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.parseJSONOrDefault<object>(
        '{ "name":"Test", "age":30 }',
        {}
      );
      expect(Actual).toEqual({ name: 'Test', age: 30 });
    });
  });
});
