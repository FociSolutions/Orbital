import * as faker from 'faker';
import Json from './json';

describe('mapToObject', () => {
  it('changes Map into Object equivalent', () => {
    const testMap = new Map<string, string>();
    for (let i = 0; i < 10; i++) {
      testMap.set(faker.random.uuid(), faker.random.word());
    }
    const result = Json.mapToObject(testMap) as any;
    for (const k of testMap.keys()) {
      expect(testMap.get(k)).toEqual(result[k]);
    }
  });

  it('it recurses through an object applying change to every level', () => {
    const testMap = new Map<string, string>();
    for (let i = 0; i < 10; i++) {
      testMap.set(faker.random.uuid(), faker.random.word());
    }
    let testObject = {
      outerProp: new Map<string, string>(testMap),
      innerObj: {
        innerProp: new Map<string, string>(testMap)
      }
    };

    testObject = Json.mapToObject(testObject) as any;
    for (const k of testMap.keys()) {
      expect(testMap.get(k)).toEqual(testObject.outerProp[k]);
      expect(testMap.get(k)).toEqual(testObject.innerObj.innerProp[k]);
    }
  });
});

describe('objectToMap', () => {
  it('converts an Object into a Map', () => {
    const testObject = Object.create(null);
    for (let i = 0; i < 10; i++) {
      testObject[faker.random.uuid()] = faker.random.word();
    }
    const result = Json.objectToMap(testObject);
    for (const key of result.keys()) {
      expect(result.get(key)).toEqual(testObject[key]);
    }
  });
});
