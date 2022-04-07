import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'getStringErrors',
})
export class GetStringErrorsPipe implements PipeTransform {
  /**
   * Converts a Validation Error object into an array of strings where each string is a validation error message.
   * Note: only errors with string values are included, others, i.e. boolean errors are ignored.
   * @param errors The ValidationErrors object
   */
  transform(errors: ValidationErrors | null): string[] {
    return Object.values(errors ?? {}).filter((x: unknown): x is string => typeof x === 'string');
  }
}
