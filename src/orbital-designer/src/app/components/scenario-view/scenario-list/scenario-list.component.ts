import { Component, OnInit } from '@angular/core';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';
import { DesignerStore } from '../../../../../src/app/store/designer-store';

@Component({
  selector: 'app-scenario-list',
  templateUrl: './scenario-list.component.html',
  styleUrls: ['./scenario-list.component.scss']
})
export class ScenarioListComponent implements OnInit {
  scenarios: Scenario[];
  constructor(private designerStore: DesignerStore) {
    this.designerStore.state$.subscribe(() => {
      this.scenarios = this.designerStore.state.mockDefinition.scenarios;
    });
  }

  ngOnInit() {}
}
