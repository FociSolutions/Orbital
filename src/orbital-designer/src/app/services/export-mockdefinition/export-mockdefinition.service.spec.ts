import { TestBed } from '@angular/core/testing';

import { ExportMockdefinitionService } from './export-mockdefinition.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('ExportMockdefinitionService', () => {
  let service: ExportMockdefinitionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportMockdefinitionService],
      imports: [HttpClientTestingModule, LoggerTestingModule]
    });
    service = TestBed.get(ExportMockdefinitionService);
  }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
