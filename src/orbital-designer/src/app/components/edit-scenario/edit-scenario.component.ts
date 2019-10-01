import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  Scenario,
  newScenario
} from 'src/app/models/mock-definition/scenario/scenario.model';
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
  bodyRuleType: string;
  bodyRuleValue: string;
  valid = true;

  headerKeysList = [
    'Authorization',
    'Cache-Control',
    'Content-Id',
    'Content-Length',
    'Content-Range',
    'Content-Type',
    'Content-Transfer-Encoding',
    'Date',
    'ETag',
    'Expires',
    'Host',
    'If-Match',
    'If-None-Match',
    'Location',
    'Range'
  ];

  constructor(
    private app: AppStore,
    private mockDefinitionStore: MockDefinitionStore,
    private toastr: ToastrService
  ) {
    this.app.state$.subscribe(state => {
      if (!!state.selectedScenario) {
        this.valid = true;
        this.scenario = this.deepCopy(state.selectedScenario);
        if (this.scenario.requestMatchRules.bodyRules.length > 0) {
          this.bodyRuleType = this.scenario.requestMatchRules.bodyRules[0].type.toString();
          this.bodyRuleValue = JSON.stringify(
            this.scenario.requestMatchRules.bodyRules[0].rule
          );
        } else {
          this.bodyRuleType = '';
          this.bodyRuleValue = '';
        }
      }
    });
  }

  onSelectBodyRuleType(type: string) {
    if (type.toString() === '') {
      this.scenario.requestMatchRules.bodyRules = [];
    } else {
      this.scenario.requestMatchRules.bodyRules = [
        { rule: {}, type: BodyRuleType.BodyEquality }
      ];
      this.bodyRuleValue = '';
    }
    this.bodyRuleType = type;
  }

  /**
   * Attempts to parse a string into JSON and set the body rule to the JSON object
   * representation. If the string fails to parse to JSON it logs the error in console
   * and does nothing
   * @param rule The string to try and parse into a JSON
   */
  onBodyRuleEdit(rule: string) {
    try {
      this.scenario.requestMatchRules.bodyRules[0].rule = JSON.parse(rule);
      this.valid = true;
    } catch (e) {
      this.valid = false;
      /**
       * Add to error messages to display when user tries to save the scenario
       */
      console.log(e);
    }
    this.bodyRuleValue = rule;
  }

  /**
   * Function that saves the changes made to the scenario by updating the mockDefinitionStore
   */
  onSave() {
    if (!this.valid) {
      this.toastr.error('Invalid Scenario');
      /**
       * This should display more informative error messages (another task)
       */
    } else {
      let scenarios = this.mockDefinitionStore.state.scenarios;
      const scenario = this.deepCopy(this.scenario);
      const index = scenarios.findIndex(s => s.id === this.scenario.id);
      if (index < 0) {
        scenarios = [...scenarios, scenario];
      } else {
        scenarios.splice(index, 1, scenario);
      }
      this.mockDefinitionStore.updateScenarios(scenarios);
      this.toastr.success('Scenario Saved!', '', {
        timeOut: 2000
      });
    }
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

  /**
   * Exposing the enums for use in template
   */
  get BodyRuleTypes() {
    return BodyRuleType;
  }

  ngOnInit() {}

  private deepCopy(s: Scenario): Scenario {
    return {
      ...s,
      response: {
        ...s.response,
        headers: new Map(s.response.headers)
      },
      requestMatchRules: {
        bodyRules: s.requestMatchRules.bodyRules.map(br => ({ ...br })),
        headerRules: new Map(s.requestMatchRules.headerRules),
        queryRules: new Map(s.requestMatchRules.queryRules)
      },
      metadata: {
        ...s.metadata
      }
    };
  }
}
