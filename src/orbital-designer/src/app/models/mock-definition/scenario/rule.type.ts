/**
 * Enum representation for different comparers
 */
export enum RuleType {
  NONE = 0,
  REGEX,
  TEXTSTARTSWITH,
  TEXTENDSWITH,
  TEXTCONTAINS,
  TEXTEQUALS,
  JSONPATH,
  JSONEQUALITY,
  JSONCONTAINS,
  JSONSCHEMA,
  ACCEPTALL,
}
