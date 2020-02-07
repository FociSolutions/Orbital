import { TestBed, inject } from '@angular/core/testing';
import { ScenarioEditorService } from './scenario-editor.service';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing/';

describe('Service: ScenarioEditor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [ScenarioEditorService, DesignerStore]
    });
  });

  it('should ...', inject(
    [ScenarioEditorService],
    (service: ScenarioEditorService) => {
      expect(service).toBeTruthy();
    }
  ));
});
