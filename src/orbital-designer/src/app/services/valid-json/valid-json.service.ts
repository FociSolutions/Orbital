import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidJsonService {
  constructor() {}

  /**
   * Checks if the provided JSON string is valid
   * @param json The JSON to validate
   */
  isValidJSON(json: string) {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns a valid JSON object if the JSON can be parsed, otherwise null
   * @param json The JSON to parse
   */
  tryParseJSON(json: string) {
    if (this.isValidJSON(json)) {
      return JSON.parse(json);
    }

    return null;
  }
}
