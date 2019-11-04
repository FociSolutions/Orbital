import { TestBed } from '@angular/core/testing';

import { ValidJsonService } from './valid-json.service';

describe('ValidJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidJsonService = TestBed.get(ValidJsonService);
    expect(service).toBeTruthy();
  });
});
