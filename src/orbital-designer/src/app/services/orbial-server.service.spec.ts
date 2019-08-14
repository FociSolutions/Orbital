import { TestBed } from '@angular/core/testing';

import { OrbialServerService } from './orbial-server.service';

describe('OrbialServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrbialServerService = TestBed.get(OrbialServerService);
    expect(service).toBeTruthy();
  });
});
