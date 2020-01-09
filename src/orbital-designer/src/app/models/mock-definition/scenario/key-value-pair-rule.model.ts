import { KeyValue } from '@angular/common';

/**
 * Model representation of KeyValue pair matching rule
 */
export interface KeyValuePairRule {
  type: KeyValue<string, string>;
  rule: object;
}
