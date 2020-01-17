/**
 * Enum representation for different comparers
 */
export enum RuleType {
  REGEX = 0,
  TEXTSTARTSWITH = 1,
  TEXTENDSWITH = 2,
  TEXTCONTAINS = 3,
  TEXTEQUALS = 4,
  JSONPATH = 5,
  JSONEQUALITY = 6,
  JSONCONTAINS = 7,
  JSONSCHEMA = 8
}
