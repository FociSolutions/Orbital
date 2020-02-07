import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Scenario,
  defaultScenario
} from 'src/app/models/mock-definition/scenario/scenario.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { map, filter } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { DesignerStore } from 'src/app/store/designer-store';

@Injectable({
  providedIn: 'root'
})
export class ScenarioEditorService {
  private scenarioOnChangeSubject: BehaviorSubject<Scenario>;
  private scenarioOnChangeObservable: Observable<Scenario>;

  constructor(private designerStore: DesignerStore) {
    this.scenarioOnChangeSubject = new BehaviorSubject<Scenario>(
      defaultScenario
    );

    this.designerStore.state$.subscribe(state =>
      this.scenarioOnChangeSubject.next(state.selectedScenario)
    );

    this.scenarioOnChangeObservable = this.scenarioOnChangeSubject.asObservable();
  }

  /**
   * Observable for all scenario changes
   */
  get scenarioOnChange$(): Observable<Scenario> {
    return this.scenarioOnChangeObservable;
  }

  /**
   * Observable for all changes to the urlEditRule
   */
  get urlEditRulesOnChange$(): Observable<KeyValuePairRule[]> {
    return this.scenarioOnChange$.pipe(
      filter(s => !!s && !!s.requestMatchRules),
      map(s => s.requestMatchRules.urlRules || [])
    );
  }

  /**
   * Updated the Url Edit Rules, and pushed the values to the Scenario Subject
   * @param urlEditRules The new list of Url Edit Rules
   */
  updateUrlEditRules(urlEditRules: KeyValuePairRule[]): void {
    if (!urlEditRules) {
      throw new Error('urlEditRules cannot be null or undefined');
    }

    const newScenario = cloneDeep(this.scenarioOnChangeSubject.value);
    newScenario.requestMatchRules.urlRules = urlEditRules;
    this.scenarioOnChangeSubject.next(newScenario);
  }
}
