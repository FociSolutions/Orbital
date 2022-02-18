export enum JsonRuleCondition {
  PATH = 0,
  EQUALITY,
  CONTAINS,
  SCHEMA,
}

export enum TextRuleCondition {
  STARTS_WITH = 0,
  ENDS_WITH,
  CONTAINS,
  EQUALS,
}

export enum BodyRuleType {
  JSON = 1,
  TEXT,
}

export interface JsonBodyRule {
  ruleType: BodyRuleType.JSON;
  ruleCondition: JsonRuleCondition;
  value: string;
}

export interface TextBodyRule {
  ruleType: BodyRuleType.TEXT;
  ruleCondition: TextRuleCondition;
  value: string;
}

export type InternalRuleType =
  | Pick<TextBodyRule, 'ruleType' | 'ruleCondition'>
  | Pick<JsonBodyRule, 'ruleType' | 'ruleCondition'>;

export type InternalBodyRuleItemFormValues = JsonBodyRule | TextBodyRule;
