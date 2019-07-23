import { Pipe, PipeTransform } from '@angular/core';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { Endpoint } from '../models/endpoint.model';

@Pipe({
  name: 'getEndpointScenarios'
})
export class GetEndpointScenariosPipe implements PipeTransform {
  /**
   * Filters a list of scenarios, leaving only the scenarios whose path and verb match
   * the path and verb of the endpoint argument
   * @param scenarios The list of scenarios to filter
   * @param endpoint The endpoint to filter the scenarios against
   */
  transform(scenarios: Scenario[] = [], endpoint: Endpoint): Scenario[] {
    if (!endpoint) {
      return scenarios;
    }
    return scenarios.filter(
      scenario =>
        scenario.path === endpoint.path && scenario.verb === endpoint.verb
    );
  }
}
