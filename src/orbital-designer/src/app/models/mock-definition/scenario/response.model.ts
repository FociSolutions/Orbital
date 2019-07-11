/**
 * Model representation of a mock response
 */
export interface Response {
  headers: Map<string, string>;
  body: string;
  status: number;
}
