import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidJsonService {
  static getValidator =
    (required: boolean = true) =>
    (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return required ? { required: true } : null;
      }

      try {
        const value = JSON.parse(control.value);

        // Yes, `typeof []` and `typeof null` returns 'object'
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          return { top_level_object: 'The top-level JSON must be an object' };
        }

        if (!Object.keys(value).length && required) {
          return { empty: 'The top-level JSON object cannot be empty' };
        }
      } catch (error: unknown) {
        return { invalid: 'The content is not valid JSON' };
      }

      return null;
    };
}
