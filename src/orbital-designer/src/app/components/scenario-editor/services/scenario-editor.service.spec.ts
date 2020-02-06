/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScenarioEditorService } from './scenario-editor.service';

describe('Service: ScenarioEditor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScenarioEditorService]
    });
  });

  it('should ...', inject([ScenarioEditorService], (service: ScenarioEditorService) => {
    expect(service).toBeTruthy();
  }));
});
