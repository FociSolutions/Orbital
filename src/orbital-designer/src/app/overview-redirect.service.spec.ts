import { TestBed } from '@angular/core/testing';

import { OverviewRedirectService } from './overview-redirect.service';

describe('OverviewRedirectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverviewRedirectService = TestBed.get(OverviewRedirectService);
    expect(service).toBeTruthy();
  });
});
