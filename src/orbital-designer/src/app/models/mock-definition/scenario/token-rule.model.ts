import { ValidationType } from "../token-validation.model";
import { KeyValuePairRule } from "./key-value-pair-rule.model";
import { RuleType } from "./rule.type";

/**
 * Model representation of a token rule
 */
export interface TokenRule {
  validationType: number,
  checkExpired: boolean,
  rules: KeyValuePairRule[]
}

export const defaultTokenRule: TokenRule = {
  validationType: ValidationType.NONE,
  checkExpired: false,
  rules: []
}
