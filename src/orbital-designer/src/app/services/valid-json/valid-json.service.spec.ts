import { TestBed, async } from '@angular/core/testing';
import { ValidJsonService } from './valid-json.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import * as faker from 'faker';

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
      const invalidJSONString: string = faker.random.word();
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.parseJSONOrDefault<object>(invalidJSONString, {});
      expect(Actual).toEqual({});
    });
  });
  describe('add-body-rule.parseJSONOrDefault', () => {
    it('should return the JSON object value if the JSON can be parsed ', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.parseJSONOrDefault<object>('{ "name":"Test", "age":30 }', {});
      expect(Actual).toEqual({ name: 'Test', age: 30 });
    });
  });

  describe('add-body-rule.validateSchema', () => {
    it('should return true if the given JSON string is a valid schema', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.validateSchema(`{
        "properties": {
          "id": {
            "type": "number",
            "readOnly": true
          }
        }  
     }
      `);
      expect(Actual).toBe(true);
    });

    it('should return false if the given JSON string is an invalid schema', () => {
      const service: ValidJsonService = TestBed.get(ValidJsonService);
      const Actual = service.validateSchema(`{
        "$id": "https://example.com/person.schema.json",
        "$schema_invalid_text": "http://json-schema.org/draft-04/schema#",
        "title": "Person",
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string",
            "description": "The person's first name."
          }
        }
      }`);
      expect(Actual).toBe(false);
    });
  });
});
