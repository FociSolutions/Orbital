import { TestBed } from '@angular/core/testing';

import { ExportMockdefinitionService } from './export-mockdefinition.service';

describe('ExportMockdefinitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportMockdefinitionService = TestBed.get(ExportMockdefinitionService);
    expect(service).toBeTruthy();
  });
});
