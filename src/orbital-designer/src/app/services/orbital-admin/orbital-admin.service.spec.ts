import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalAdminService } from './orbital-admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrbitalAdminService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [OrbitalAdminService],
      imports: [HttpClientTestingModule, LoggerTestingModule]
    })
  );

  it('should be created', () => {
    const service: OrbitalAdminService = TestBed.get(OrbitalAdminService);
    expect(service).toBeTruthy();
  });
});
