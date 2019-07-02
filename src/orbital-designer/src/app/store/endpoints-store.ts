import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { OpenAPIV2 } from 'openapi-types';
import { Endpoint } from '../models/endpoint.model';
import { VerbType } from '../models/verb.type';

class EndpointsState {
  endpoints: Endpoint[] = [];
}

@Injectable()
export class EndpointsStore extends Store<EndpointsState> {
  constructor() {
    super(new EndpointsState());
  }

  /**
   * addEndpoints reads the details of the endpoints specified in the Open Api document
   * and updates the state of the endpointStore.
   * @param doc The parsed Open Api document to extrapolate the endpoints from
   */
  addEndpoints(doc: OpenAPIV2.Document) {
    const pathStrings = Object.keys(doc.paths);
    for (const path of pathStrings) {
      const pathObject: OpenAPIV2.PathItemObject = doc.paths[path];
      const newEndpoints = Object.keys(VerbType)
        .map(verb => ({ verb: VerbType[verb], lowerVerb: verb.toLowerCase() }))
        .map(({ verb, lowerVerb }) =>
          !!pathObject[lowerVerb]
            ? { path, verb, spec: pathObject[lowerVerb] }
            : null
        )
        .filter(endpoint => !!endpoint);
      this.setState({
        endpoints: [...this.state.endpoints, ...newEndpoints]
      });
    }
  }
}
