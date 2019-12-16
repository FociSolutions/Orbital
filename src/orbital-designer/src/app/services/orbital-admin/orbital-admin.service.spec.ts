import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalAdminService } from './orbital-admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DesignerStore } from 'src/app/store/designer-store';
import * as faker from 'faker';

describe('OrbitalAdminService', () => {
  let service: OrbitalAdminService;
  beforeEach(() =>{
    TestBed.configureTestingModule({
      providers: [OrbitalAdminService, DesignerStore],
      imports: [HttpClientTestingModule, LoggerTestingModule]
    });
    service = TestBed.get(OrbitalAdminService);
  }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  fdescribe('EndpointViewComponent.onSubmit()', () => {
    it('Should change ExportedMessage to contain a message saying there is an error uploading Mockdefinition', done  => {
      expect(service.deleteMockDefinition(faker.random.words(), 'testMockID')).toThrowError();

    });
  });
});
