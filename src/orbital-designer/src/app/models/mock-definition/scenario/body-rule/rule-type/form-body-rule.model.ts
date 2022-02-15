import { JsonBodyRule } from './json-body-rule.model';
import { TextBodyRule } from './text-body-rule.model';

/**
 * Model representation of body matching rule
 */
export type FormBodyRule = JsonBodyRule | TextBodyRule;
