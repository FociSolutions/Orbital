import { Pipe, PipeTransform } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';

@Pipe({
  name: 'getRuleTypeString',
})
export class GetRuleTypeStringPipe implements PipeTransform {
  /**
   * Takes in a ruleType and outputs the corresponding ruleType as a nicely formatted string
   * @param ruleType The ruleType to be piped in
   */
  transform(ruleType: RuleType): string {
    switch (ruleType) {
      case RuleType.NONE:
        return 'None';
      case RuleType.REGEX:
        return 'Match Regex';
      case RuleType.TEXTSTARTSWITH:
        return 'Text: Starts With';
      case RuleType.TEXTENDSWITH:
        return 'Text: Ends With';
      case RuleType.TEXTCONTAINS:
        return 'Text: Contains';
      case RuleType.TEXTEQUALS:
        return 'Text: Equals';
      case RuleType.JSONPATH:
        return 'JSON: Path';
      case RuleType.JSONEQUALITY:
        return 'JSON: Equality';
      case RuleType.JSONCONTAINS:
        return 'JSON: Contains';
      case RuleType.JSONSCHEMA:
        return 'JSON: Schema';
      case RuleType.ACCEPTALL:
        return 'Accept All';
      default: {
        // Cause a type-check error if a case is missed
        const _: never = ruleType;
        return 'Invalid Rule';
      }
    }
  }
}
