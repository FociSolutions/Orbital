import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { OpenAPIV2 } from 'openapi-types';
import { Endpoint } from '../models/endpoint.model';
import { VerbType } from '../models/verb.type';

@Injectable()
export class EndpointsStore extends Store<Endpoint[]> {
  constructor() {
    super([]);
  }

  /**
   * setEndpoints reads the details of the endpoints specified in the Open Api document
   * and updates the state of the endpointStore.
   * @param doc The parsed Open Api document to extrapolate the endpoints from
   */
  setEndpoints(doc: OpenAPIV2.Document, clearStore = true) {
    const pathStrings = Object.keys(doc.paths);
    let endpoints = [];
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
      endpoints = [...endpoints, ...newEndpoints];
    }
    this.setState(clearStore ? endpoints : [...this.state, ...endpoints]);
  }
}
