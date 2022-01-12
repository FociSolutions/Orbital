import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { jsonErrorType } from 'src/app/models/mock-definition/scenario/json-error-type';

@Injectable({
  providedIn: 'root',
})
export class ValidJsonService {
  constructor(private logger: NGXLogger) {}

  readonly jsonErrorMap = new Map([
    [jsonErrorType.EMPTY, ' cannot be empty'],
    [jsonErrorType.INVALID, ' be valid JSON'],
    [jsonErrorType.EMPTY_JSON, ' must have content'],
  ]);

  /**
   * Returns an errortype depending on JSON string content
   * @param json The JSON string to check
   * @return the error type
   */
  checkJSON(json: string): jsonErrorType {
    if (json == '') {
      return jsonErrorType.EMPTY;
    }
    try {
      const parsedJson = JSON.parse(json);
      if (Object.keys(parsedJson).length == 0) {
        return jsonErrorType.EMPTY_JSON;
      }
      if (typeof parsedJson != 'object') {
        return jsonErrorType.INVALID;
      }
      return jsonErrorType.NONE;
    } catch (e) {
      return jsonErrorType.INVALID;
    }
  }
}
