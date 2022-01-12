import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalAdminService } from './orbital-admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrbitalAdminService', () => {
  let service: OrbitalAdminService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrbitalAdminService],
      imports: [HttpClientTestingModule, LoggerTestingModule],
    });
    service = TestBed.get(OrbitalAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
