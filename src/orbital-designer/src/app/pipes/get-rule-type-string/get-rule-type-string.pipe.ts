/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Pipe, PipeTransform } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';

@Pipe({
  name: 'getRuleTypeString',
})
export class GetRuleTypeStringPipe implements PipeTransform {
  /**
   * Takes in a ruleType and outputs the corresponding ruleType as a nicely formatted string
   * @param ruleType The ruleType to be piped in
   */
  transform(ruleType: RuleType): string {
    switch (+ruleType) {
      case 0:
        return 'None';
      case 1:
        return 'Regex';
      case 2:
        return 'Text: Starts With';
      case 3:
        return 'Text: Ends With';
      case 4:
        return 'Text: Contains';
      case 5:
        return 'Text: Equals';
      case 6:
        return 'JSON: Path';
      case 7:
        return 'JSON: Equality';
      case 8:
        return 'JSON: Contains';
      case 9:
        return 'JSON: Schema';
      default:
        return 'Invalid Rule';
    }
  }
}
