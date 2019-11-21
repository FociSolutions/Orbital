import { GetVerbColorPipe } from './get-verb-color.pipe';
import { VerbType } from '../../models/verb.type';
import * as faker from 'faker';

describe('GetVerbColorPipe', () => {
  it('create an instance', () => {
    const pipe = new GetVerbColorPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns rgba(0, 163, 255, 0.25) for VerbType GET', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.GET);
    expect(colorType).toBe('rgba(0, 163, 255, 0.25)');
  });

  it('returns rgba(255, 0, 0, 0.25) for VerbType DELETE', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.DELETE);
    expect(colorType).toBe('rgba(255, 0, 0, 0.25)');
  });

  it('returns rgba(30, 255, 160, 0.25) for VerbType POST', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.POST);
    expect(colorType).toBe('rgba(30, 255, 160, 0.25)');
  });

  it('returns rgba(222, 226, 0, 0.25) for VerbType PUT', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.PUT);
    expect(colorType).toBe('rgba(222, 226, 0, 0.25)');
  });

  it('prefixes the returned color type with the provide prefix argument', () => {
    const pipe = new GetVerbColorPipe();
    const prefix = faker.random.word();
    const result = pipe.transform(VerbType.GET, `${prefix}-`);
    expect(result).toBe(`${prefix}-rgba(0, 163, 255, 0.25)`);
  });
});
