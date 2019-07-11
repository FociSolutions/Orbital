import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { AppStore } from 'src/app/store/app-store';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-scenario',
  templateUrl: './edit-scenario.component.html',
  styleUrls: ['./edit-scenario.component.scss']
})
export class EditScenarioComponent implements OnInit {
  scenario: Scenario;
  /**
   * Initializes the internal scenario
   */
  @Input() set scenarioInput(scenario: Scenario) {
    this.scenario = { ...scenario };
  }
  bodyRuleType = BodyRuleType.BodyEquality;

  constructor(
    private app: AppStore,
    private mockDefinitionStore: MockDefinitionStore,
    private toastr: ToastrService
  ) {}

  onSave() {
    let scenarios = this.mockDefinitionStore.state.scenarios;
    const index = scenarios.findIndex(s => s.id === this.scenario.id);
    if (index < 0) {
      scenarios = [...scenarios, this.scenario];
    } else {
      scenarios.splice(index, 1, this.scenario);
    }
    this.mockDefinitionStore.updateScenarios(scenarios);
    this.toastr.success('Scenario Saved!', '', {
      timeOut: 2000
    });
    this.app.showEditor = true;
  }

  onDelete() {
    this.mockDefinitionStore.updateScenarios(
      this.mockDefinitionStore.state.scenarios.filter(
        s => s.id !== this.scenario.id
      )
    );
    this.app.showEditor = true;
  }

  onCancel() {
    /**
     * <TODO> To be implemented later after scenario validation is done, should check if scenario is valid before canceling.
     * This button should clear the form's unsaved fields while keeping showEditor = true
     */

    this.app.showEditor = false;
  }

  get BodyRuleTypes() {
    return BodyRuleType;
  }

  ngOnInit() {}
}
