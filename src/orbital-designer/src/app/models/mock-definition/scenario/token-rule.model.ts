import { KeyValueRule } from './key-value-rule.model';

/**
 * Model representation of a token rule
 */
export interface TokenRule {
  validationType: ValidationType;
  rules: KeyValueRule[];
}

export enum ValidationType {
  NONE,
  JWT_VALIDATION,
  JWT_VALIDATION_AND_REQUEST_MATCH,
  CONTENT,
}

export const defaultTokenRule: TokenRule = {
  validationType: ValidationType.NONE,
  rules: [],
};
