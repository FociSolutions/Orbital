import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ValidJsonService {
  constructor(private logger: NGXLogger) {}

  /**
   * Checks if the provided JSON string is valid
   * @param json The JSON to validate
   */
  isValidJSON(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      this.logger.error('Invalid JSON File', e);
      return false;
    }
  }

  /**
   * Returns a valid JSON object if the JSON can be parsed, otherwise the default value
   * @param json The JSON to parse
   */
  parseJSONOrDefault<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json) as T;
    } catch (e) {
      this.logger.error('Invalid JSON file', e);
      return defaultValue;
    }
  }
}
