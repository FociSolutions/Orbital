import { PolicyType } from './policy.type';

export interface Policy {
  type: PolicyType;
  attributes: Record<string, string>;
}

export const defaultPolicy: Policy = {
  type: PolicyType.NONE,
  attributes: {}
};
