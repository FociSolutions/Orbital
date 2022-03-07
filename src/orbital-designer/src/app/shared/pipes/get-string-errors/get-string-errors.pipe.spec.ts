import { GetStringErrorsPipe } from './get-string-errors.pipe';

describe('GetStringErrorsPipe', () => {
  it('create an instance', () => {
    const pipe = new GetStringErrorsPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns an empty array if there are no errors', () => {
    const pipe = new GetStringErrorsPipe();
    const expected: string[] = [];
    const actual = pipe.transform({});
    expect(actual).toEqual(expected);
  });

  it('returns an empty array if there are no string errors', () => {
    const pipe = new GetStringErrorsPipe();
    const expected: string[] = [];
    const actual = pipe.transform({ required: true });
    expect(actual).toEqual(expected);
  });

  it('returns an an array with a single string when there is one string error', () => {
    const pipe = new GetStringErrorsPipe();
    const expected = ['test'];
    const actual = pipe.transform({ required: 'test' });
    expect(actual).toEqual(expected);
  });

  it('returns an an array of strings when there is more than one string error', () => {
    const pipe = new GetStringErrorsPipe();
    const expected = ['test', 'test2', 'test3'];
    const actual = pipe.transform({ required: 'test', manLength: 'test2', maxLength: 'test3' });
    expect(actual).toEqual(expected);
  });
});
