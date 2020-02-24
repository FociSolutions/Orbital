import { PolicyType } from './policy.type';

export interface Policy {
  type: PolicyType;
  attributes: Record<string, number | string>;
}

export const defaultDelayPolicy: Policy = {
  type: PolicyType.NONE,
  attributes: { delay: 0 }
};
