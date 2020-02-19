import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { NGXLogger } from 'ngx-logger';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-add-request-match-rule',
  templateUrl: './add-request-match-rule.component.html',
  styleUrls: ['./add-request-match-rule.component.scss']
})
export class AddRequestMatchRuleComponent implements OnInit {
  @Input() requestMatchRule: RequestMatchRule;
  @Output() requestMatchRuleOutput: EventEmitter<RequestMatchRule>;
  @Input() requestMatchRuleFormGroup: FormGroup;

  headerMatchRules: KeyValuePairRule[];
  queryMatchRules: KeyValuePairRule[];
  bodyMatchRules: BodyRule[];

  shouldSave: boolean;
  panelExpanded: boolean;
  isCardDisabled: boolean;

  headerEmitted: boolean;
  queryEmitted: boolean;
  bodyEmitted: boolean;

  constructor(private logger: NGXLogger) {
    this.requestMatchRuleOutput = new EventEmitter<RequestMatchRule>();
    this.headerMatchRules = [];
    this.queryMatchRules = [];
    this.bodyMatchRules = [];
  }

  ngOnInit() {}

  /*
   * Sets the save status
   */
  @Input()
  set saveStatus(save: boolean) {
    this.shouldSave = save;
  }

  /**
   * Emits the request match rule if the header, query, and body fields have already emitted
   */
  _save() {
    if (this.headerEmitted && this.queryEmitted && this.bodyEmitted) {
      // validate request match rules
      const requestToEmit = {
        headerRules: this.headerMatchRules,
        queryRules: this.queryMatchRules,
        bodyRules: this.bodyMatchRules
      } as RequestMatchRule;
      this.requestMatchRuleOutput.emit(requestToEmit);
      this.logger.debug('The request match rules have been emitted', requestToEmit);
      this.headerEmitted = false;
      this.queryEmitted = false;
      this.bodyEmitted = false;
    }
  }

  /**
   * Handles saving the header match rules kvp values
   * @param headerMatchRules The incoming request match rules
   */
  handleHeaderKvpOutput(headerMatchRules: KeyValuePairRule[]) {
    this.headerEmitted = true;
    this.logger.debug('Set the header match rules to', headerMatchRules);
    this.headerMatchRules = headerMatchRules;
    this._save();
  }

  /**
   * Handles the query kvp pair output
   * @param queryMatchRules The query match rules to use
   */
  handleQueryKvpOutput(queryMatchRules: KeyValuePairRule[]) {
    this.queryEmitted = true;
    this.logger.debug('Set the query match rules to', queryMatchRules);
    this.queryMatchRules = queryMatchRules;
    this._save();
  }

  /**
   * Handles the body output
   * @param bodyMatchRules The body match rules to use
   */
  handleBodyOutput(bodyMatchRules: BodyRule[]) {
    this.bodyEmitted = true;
    this.logger.debug('Set the body match rules to', bodyMatchRules);
    this.bodyMatchRules = bodyMatchRules;
    this._save();
  }
}
