import { JSONPath } from './JSONPath';
import { HeaderEquality } from './HeaderEquality';
import { Response } from './Response';
import { BodyEqualityRule } from './BodyEqualityRule';
import { SchemaMatchRule } from './SchemaMatchRule';

export interface RequestMatch {
  jsonPath: JSONPath;
  headerEquality: HeaderEquality;
  response: Response;
  schemaMatchRule: SchemaMatchRule;
  bodyEqualityRule: BodyEqualityRule;
}
//<br/>
