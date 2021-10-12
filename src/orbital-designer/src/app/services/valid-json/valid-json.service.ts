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
    return !!this.parseJSONOrDefault<boolean>(json, false);
  }

  /**
   * Returns a valid JSON object if the JSON can be parsed, otherwise the default value
   * @param json The JSON to parse
   * @param defaultValue The default value to return if the string cannot be parsed
   */
  parseJSONOrDefault<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json);
    } catch (e) {
      return defaultValue;
    }
  }
}
