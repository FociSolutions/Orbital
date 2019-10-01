import { EndpointsStore } from './endpoints-store';
import validOpenApi from '../../test-files/valid-openapi-spec';
import * as faker from 'faker';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { VerbType } from '../models/verb.type';

describe('EndpointsStore', () => {
  it('should create an instance', () => {
    expect(new EndpointsStore()).toBeTruthy();
  });

  it('should update the state with new endpoints', done => {
    const petStore = validOpenApi;
    const endpointStore = new EndpointsStore();
    const acceptedVerbs = Object.keys(VerbType).map(verb => verb.toLowerCase());
    expect(endpointStore.state).toEqual([]);
    MockDefinition.toOpenApiSpec(petStore).then(doc => {
      endpointStore.setEndpoints(doc);
      for (const path of Object.keys(doc.paths)) {
        for (const verb of acceptedVerbs) {
          if (!!doc.paths[path][verb]) {
            expect(
              endpointStore.state.findIndex(
                endpoint =>
                  endpoint.path === path &&
                  endpoint.verb === VerbType[verb.toUpperCase()] &&
                  endpoint.spec === doc.paths[path][verb]
              )
            ).toBeGreaterThan(-1);
          }
        }
      }
      done();
    });
  });

  it('should update the state with new endpoints without clearing old ones', done => {
    const petStore = validOpenApi;
    const endpointStore = new EndpointsStore();
    const originalEndpoint = {
      path: '/original-pets',
      verb: VerbType.GET,
      spec: null
    };
    endpointStore.setState([originalEndpoint]);
    const acceptedVerbs = Object.keys(VerbType).map(verb => verb.toLowerCase());
    expect(endpointStore.state).toEqual([originalEndpoint]);
    MockDefinition.toOpenApiSpec(petStore).then(doc => {
      endpointStore.setEndpoints(doc, false);
      for (const path of Object.keys(doc.paths)) {
        for (const verb of acceptedVerbs) {
          if (!!doc.paths[path][verb]) {
            expect(
              endpointStore.state.findIndex(
                endpoint =>
                  endpoint.path === path &&
                  endpoint.verb === VerbType[verb.toUpperCase()] &&
                  endpoint.spec === doc.paths[path][verb]
              )
            ).toBeGreaterThan(-1);
          }
        }
      }
      expect(
        endpointStore.state.findIndex(e => e === originalEndpoint)
      ).toBeGreaterThan(-1);
      done();
    });
  });
});
