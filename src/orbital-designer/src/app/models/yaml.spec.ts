import * as faker from 'faker';
import Yaml from './yaml';

describe('toYamlSafe', () => {
  it('changes Map into array equivalent', () => {
    const testMap = new Map<string, string>();
    for (let i = 0; i < 10; i++) {
      testMap.set(faker.random.uuid(), faker.random.word());
    }
    const result = Yaml.collectionToArray(testMap) as Array<[string, string]>;
    expect(new Map<string, string>(result)).toEqual(testMap);
  });

  it('changes Set into array equivalent', () => {
    const testSet = new Set<string>();
    for (let i = 0; i < 10; i++) {
      testSet.add(faker.random.word());
    }
    const result = Yaml.collectionToArray(testSet) as Set<string>;
    expect(new Set<string>(result)).toEqual(testSet);
  });

  it('it recurses through an object applying change to every level', () => {
    const testMap = new Map<string, string>();
    const testSet = new Set<string>();
    for (let i = 0; i < 10; i++) {
      testMap.set(faker.random.uuid(), faker.random.word());
      testSet.add(faker.random.word());
    }
    const control = {
      testMap,
      testSet,
      innerObj: {
        testMap,
        testSet
      }
    };

    let testObject = {
      ...control,
      innerObj: {
        ...control.innerObj
      }
    };

    testObject = Yaml.collectionToArray(testObject) as any;
    const result = {
      testMap: new Map(testObject.testMap),
      testSet: new Set(testObject.testSet),
      innerObj: {
        testMap: new Map(testObject.innerObj.testMap),
        testSet: new Set(testObject.innerObj.testSet)
      }
    };
    expect(result).toEqual(control);
  });
});
