import { Component, OnInit, OnDestroy } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import * as uuid from 'uuid';
import { Subscription } from 'rxjs';
import { VerbType } from 'src/app/models/verb.type';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit, OnDestroy {
  private storeSubscription: Subscription;

  endpointVerb: VerbType;
  endpointPath: string;

  scenarioList: Scenario[] = [];
  filteredList: Scenario[] = [];

  errorMessage: string;

  constructor(
    private store: DesignerStore,
    private router: Router,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.storeSubscription = this.store.state$.subscribe(state => {
      if (!!state.mockDefinition && !!state.selectedEndpoint) {
        this.endpointVerb = state.selectedEndpoint.verb;
        this.endpointPath = state.selectedEndpoint.path;
        this.scenarioList = state.mockDefinition.scenarios.filter(
          s =>
            s.path === this.endpointPath &&
            s.verb.toUpperCase() === this.endpointVerb.toUpperCase()
        );
        this.logger.log(
          'ScenarioViewComponent:ngOnInit: Resulting ScenarioList: ',
          this.scenarioList
        );
      }
    });

    this.errorMessage =
      'No scenarios exist. Click the add button to create a new scenario.';
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  addScenario() {
    this.router.navigate(['/scenario-editor', uuid.v4()]);
  }
  /**
   * Goes back to the endpoint page
   */
  goToEndpoints() {
    this.router.navigateByUrl('endpoint-view');
  }
  /**
   * This function takes an scenario object and return its path as a string
   * @param scenario The scenario to be converted to string
   */
  scenarioToString(scenario: Scenario): string {
    if (!!scenario && !!scenario.metadata) {
      return scenario.metadata.title;
    }
  }
  /**
   * This function takes a list of scenarios and updates it to the new list of filtered scenarios
   * @param scenarios The list of scenarios
   */
  setFilteredList(newScenarios: Scenario[]) {
    if (newScenarios) {
      this.filteredList = newScenarios;
    }
    this.errorMessage = 'No Result(s) Found';
  }
}
