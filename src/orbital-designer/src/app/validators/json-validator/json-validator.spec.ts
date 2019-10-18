import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import Spy = jasmine.Spy;

import { jsonValidator } from './json-validator';

// this file is from https://stackoverflow.com/questions/55748238/
describe('JSON Validator', () => {
  let control: FormControl;
  let spySetErrors: Spy;
  let validator: ValidatorFn;

  const errorName = 'jsonInvalid';

  beforeEach(() => {
    control = new FormControl(null);
    validator = jsonValidator();
    spySetErrors = spyOn(control, 'setErrors').and.callThrough();
  });

  for (const { testId, valid, value } of [
    { testId: 1, valid: true, value: '{}' },
    { testId: 2, valid: true, value: '{"myKey": "myValue"}' },
    {
      testId: 3,
      valid: true,
      value: '{"myKey1": "myValue1", "myKey2": "myValue2"}'
    },
    // more valid cases can be added...

    { testId: 4, valid: false, value: 'this is not a valid json' },
    {
      testId: 5,
      valid: false,
      value: '{"theJsonFormat": "doesntLikePendingCommas",}'
    },
    {
      testId: 6,
      valid: false,
      value: '{"theJsonFormat": doesntLikeMissingQuotes }'
    }
    // more invalid cases ca be added...
  ]) {
    it(`should only trigger the error when the control's value is not a valid JSON [${testId}]`, () => {
      const error: ValidationErrors = { [errorName]: true };
      control.setValue(value);

      if (valid) {
        expect(validator(control)).toBeNull();
        expect(control.getError(errorName)).toBeFalsy();
      } else {
        expect(validator(control)).toEqual(error);
        expect(control.getError(errorName)).toBe(true);
      }
    });
  }
});
