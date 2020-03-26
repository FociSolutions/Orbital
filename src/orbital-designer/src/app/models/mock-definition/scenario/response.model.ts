import { ResponseType } from './response.type';

/**
 * Model representation of a mock response
 */
export interface Response {
  headers: Record<string, string>;
  body: string;
  status: number;
  responseType: ResponseType;
}

export const defaultResponse: Response = {
  headers: {},
  body: '',
  status: 200,
  responseType: ResponseType.NONE
};
