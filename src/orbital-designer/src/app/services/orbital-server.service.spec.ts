import { TestBed } from '@angular/core/testing';

import { OrbitalServerService } from './orbital-server.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrbitalServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [HttpClientTestingModule]}));

  it('should be created', () => {
    const service: OrbitalServerService = TestBed.get(OrbitalServerService);
    expect(service).toBeTruthy();
  });
});
