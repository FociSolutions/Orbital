import { EndpointsStore } from './endpoints-store';
import validYaml from '../services/openApi-test-files/valid-test-cases';
import * as faker from 'faker';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { VerbType } from '../models/verb.type';

describe('EndpointsStore', () => {
  it('should create an instance', () => {
    expect(new EndpointsStore()).toBeTruthy();
  });

  it('should update the state with new endpoints', done => {
    const petStore = validYaml[0];
    const endpointStore = new EndpointsStore();
    const acceptedVerbs = Object.keys(VerbType).map(verb => verb.toLowerCase());
    expect(endpointStore.state).toEqual([]);
    MockDefinition.toOpenApiSpec(petStore).then(doc => {
      endpointStore.addEndpoints(doc);
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

  it('should clear the state when clearStore is called', () => {
    const store = new EndpointsStore();
    const mockEndpoint = {
      path: faker.internet.url(),
      verb: faker.random.arrayElement([
        VerbType.GET,
        VerbType.DELETE,
        VerbType.POST,
        VerbType.PUT
      ]),
      spec: null
    };
    store.setState([mockEndpoint]);
    expect(store.state).toEqual([mockEndpoint]);
    store.clearStore();
    expect(store.state).toEqual([]);
  });
});
