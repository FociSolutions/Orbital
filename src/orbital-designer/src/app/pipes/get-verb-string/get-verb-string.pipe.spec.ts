import { GetVerbStringPipe } from './get-verb-string.pipe';
import { VerbType } from 'src/app/models/verb.type';

describe('GetVerbStringPipe', () => {
  it('create an instance', () => {
    const pipe = new GetVerbStringPipe();
    expect(pipe).toBeTruthy();
  });
  it('returns string GET for VerbType GET', () => {
    const pipe = new GetVerbStringPipe();
    const verbString = pipe.transform(VerbType.GET);
    expect(verbString).toBe('GET');
  });

  it('returns string DELETE for VerbType DELETE', () => {
    const pipe = new GetVerbStringPipe();
    const verbString = pipe.transform(VerbType.DELETE);
    expect(verbString).toBe('DELETE');
  });

  it('returns string POST for VerbType POST', () => {
    const pipe = new GetVerbStringPipe();
    const verbString = pipe.transform(VerbType.POST);
    expect(verbString).toBe('POST');
  });

  it('returns string PUT for VerbType PUT', () => {
    const pipe = new GetVerbStringPipe();
    const verbString = pipe.transform(VerbType.PUT);
    expect(verbString).toBe('PUT');
  });
});
