import { TestBed } from '@angular/core/testing';

import { OrbialServerService } from './orbial-server.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('OrbialServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [HttpClientTestingModule]}));

  it('should be created', () => {
    const service: OrbialServerService = TestBed.get(OrbialServerService);
    expect(service).toBeTruthy();
  });
});
