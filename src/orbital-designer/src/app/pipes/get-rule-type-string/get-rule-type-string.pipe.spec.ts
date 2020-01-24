import { GetRuleTypeStringPipe } from './get-rule-type-string.pipe';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';

describe('GetVerbStringPipe', () => {
  it('create an instance', () => {
    const pipe = new GetRuleTypeStringPipe();
    expect(pipe).toBeTruthy();
  });
  it('returns string Regex if ruleType is a regex', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.REGEX);
    expect(verbString).toBe('Regex');
  });

  it('returns string Text: Starts With if ruleType is TEXTSTARTSWITH', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.TEXTSTARTSWITH);
    expect(verbString).toBe('Text: Starts With');
  });

  it('returns string Text: Ends With if ruleType is a TEXTENDSWITH', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.TEXTENDSWITH);
    expect(verbString).toBe('Text: Ends With');
  });

  it('returns string Text: Contains if ruleType is a TEXTCONTAINS', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.TEXTCONTAINS);
    expect(verbString).toBe('Text: Contains');
  });
  it('returns string Text: Equals if ruleType is a TEXTEQUALS', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.TEXTEQUALS);
    expect(verbString).toBe('Text: Equals');
  });
  it('returns string JSON: Path if ruleType is a JSONPATH', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.JSONPATH);
    expect(verbString).toBe('JSON: Path');
  });
  it('returns string JSON: Equality if ruleType is a JSONEQUALITY', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.JSONEQUALITY);
    expect(verbString).toBe('JSON: Equality');
  });

  it('returns string JSON: Contains if ruleType is a JSONContains', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.JSONCONTAINS);
    expect(verbString).toBe('JSON: Contains');
  });
  it('returns string JSON: Schema if ruleType is a JSONSCHEMA', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(RuleType.JSONSCHEMA);
    expect(verbString).toBe('JSON: Schema');
  });
  it('returns string Invalid if ruleType is invalid', () => {
    const pipe = new GetRuleTypeStringPipe();
    const verbString = pipe.transform(99);
    expect(verbString).toBe('Invalid Rule');
  });
});
