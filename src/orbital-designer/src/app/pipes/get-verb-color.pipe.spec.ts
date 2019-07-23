import { GetVerbColorPipe } from './get-verb-color.pipe';
import { VerbType } from '../models/verb.type';
import * as faker from 'faker';

describe('GetVerbColorPipe', () => {
  it('create an instance', () => {
    const pipe = new GetVerbColorPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns info for VerbType GET', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.GET);
    expect(colorType).toBe('info');
  });

  it('returns danger for VerbType DELETE', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.DELETE);
    expect(colorType).toBe('danger');
  });

  it('returns success for VerbType POST', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.POST);
    expect(colorType).toBe('success');
  });

  it('returns warning for VerbType PUT', () => {
    const pipe = new GetVerbColorPipe();
    const colorType = pipe.transform(VerbType.PUT);
    expect(colorType).toBe('warning');
  });

  it('prefixes the returned color type with the provide prefix argument', () => {
    const pipe = new GetVerbColorPipe();
    const prefix = faker.random.word();
    const result = pipe.transform(VerbType.GET, `${prefix}-`);
    expect(result).toBe(`${prefix}-info`);
  });
});
