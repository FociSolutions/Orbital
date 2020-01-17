import * as faker from 'faker';
import { KeyValueIndexSig } from './key-value-index-sig.model';

describe('KeyValueIndexSig', () => {
  it('should get the key using getKey when it is set using the key:value syntax', async () => {
    const Actual = {} as KeyValueIndexSig;
    const Expected = faker.random.word();
    Actual[Expected] = faker.random.word();
    expect(KeyValueIndexSig.getKey(Actual)).toBe(Expected);
  });

  it('should get the key as the default value when it is not set', async () => {
    const Actual = {} as KeyValueIndexSig;
    const Expected = undefined;
    expect(KeyValueIndexSig.getKey(Actual)).toBe(Expected);
  });

  it('should set the key using setKey when the object is not initialized with a key or value', async () => {
    let Actual = {} as KeyValueIndexSig;
    const Expected = faker.random.word();
    Actual = KeyValueIndexSig.setKey(Expected, Actual);
    expect(KeyValueIndexSig.getKey(Actual)).toBe(Expected);
  });

  it('should get the value when it is set using the key:value syntax', async () => {
    const Actual = {} as KeyValueIndexSig;
    const Expected = faker.random.word();
    Actual[faker.random.word()] = Expected;
    expect(KeyValueIndexSig.getValue(Actual)).toBe(Expected);
  });

  it('should get the value as the default value when it is not set', async () => {
    const Actual = {} as KeyValueIndexSig;
    const Expected = undefined;
    expect(KeyValueIndexSig.getValue(Actual)).toBe(Expected);
  });
});
