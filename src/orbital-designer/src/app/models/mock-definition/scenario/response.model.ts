/**
 * Model representation of a mock response
 */
export interface Response {
  headers: Record<string, string>;
  body: string;
  status: number;
}

export const defaultResponse: Response = {
  headers: {},
  body: '',
  status: 200
};
