import { PolicyType } from './policy-type';

export interface NonePolicy {
  type: PolicyType.NONE;
}

export interface DelayResponsePolicy {
  type: PolicyType.DELAY_RESPONSE;
  value: number;
}

export type Policy = DelayResponsePolicy | NonePolicy;

export const defaultPolicy: Policy = {
  type: PolicyType.NONE,
};
