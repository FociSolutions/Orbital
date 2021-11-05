/**
 * Model representation of the mock definition token validation
 */
export interface TokenValidation {
  validate: boolean;
  key: string;
}

export const defaultTokenValidation: TokenValidation = {
  validate: false,
  key: ''
};

export enum ValidationType {
  NONE,
  JWT_VALIDATION
};
