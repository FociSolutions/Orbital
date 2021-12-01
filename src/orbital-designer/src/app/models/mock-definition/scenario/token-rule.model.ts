import { KeyValuePairRule } from "./key-value-pair-rule.model";
import { RuleType } from "./rule.type";

/**
 * Model representation of a token rule
 */
export interface TokenRule {
  validationType: number,
  rules: KeyValuePairRule[]
}

export enum ValidationType {
  NONE,
  JWT_VALIDATION,
  JWT_VALIDATION_AND_REQUEST_MATCH,
  CONTENT
}

export const defaultTokenRule: TokenRule = {
  validationType: ValidationType.NONE,
  rules: []
}
