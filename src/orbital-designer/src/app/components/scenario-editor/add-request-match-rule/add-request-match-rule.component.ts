import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { NGXLogger } from 'ngx-logger';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

@Component({
  selector: 'app-add-request-match-rule',
  templateUrl: './add-request-match-rule.component.html',
  styleUrls: ['./add-request-match-rule.component.scss']
})
export class AddRequestMatchRuleComponent implements OnInit {
  @Input() requestMatchRule: RequestMatchRule;
  @Output() isValid: EventEmitter<boolean>;
  @Output() requestMatchRuleOutput: EventEmitter<RequestMatchRule>;
  panelExpanded: boolean;
  headerMatchRules: Map<string, string>;
  queryMatchRules: Map<string, string>;
  bodyMatchRules: BodyRule[];
  isCardDisabled: boolean;
  constructor(private logger: NGXLogger) {
    this.isValid = new EventEmitter<boolean>();
    this.requestMatchRuleOutput = new EventEmitter<RequestMatchRule>();
  }

  ngOnInit() {
  }

  /**
   * Sets whether the card can be collapsed.
   *
   * If it can be collapsed, then the card becomes non-disabled
   * If it cannot be collapsed, then the card expands and becomes disabled
   */
  set canCollapseCard(canCollapseCard: boolean) {
    if (canCollapseCard) {
      this.isCardDisabled = false;
      this.isValid.emit(true);
      this.logger.debug('canCollapse', canCollapseCard);
      this.logger.debug('isCardDisabled', this.isCardDisabled);
      this.logger.debug('panelExpanded', this.panelExpanded);
    } else {
      this.isCardDisabled = true;
      this.panelExpanded = true;
      this.isValid.emit(false);
    }
  }

 /*
  * Sets the save status
  */
  set saveStatus(shouldSave: boolean) {
    if (shouldSave) {
      // validate request match rules
      if (!!this.headerMatchRules && !!this.queryMatchRules && !!this.bodyMatchRules) {
        this.requestMatchRuleOutput.emit(JSON.parse(JSON.stringify(this.requestMatchRule)));
        this.logger.debug('The request match rules have been emitted', this.requestMatchRule);
        this.canCollapseCard = true;
      }
    } else {
      this.canCollapseCard = false;
    }
  }

  /**
   * Handles saving the header match rules kvp values
   * @param event The incoming request match rules
   */
  handleHeaderKvpOutput(headerMatchRules: Map<string, string>) {
    if (!!headerMatchRules) {
      this.logger.debug('Set the header match rules to', headerMatchRules);
      this.headerMatchRules = headerMatchRules;
    }
  }

  /**
   * Handles the query kvp pair output
   * @param queryMatchRules The query match rules to use
   */
  handleQueryKvpOutput(queryMatchRules: Map<string, string>) {
    if (!!queryMatchRules) {
      this.logger.debug('Set the query match rules to', queryMatchRules);
      this.queryMatchRules = queryMatchRules;
    }
  }

  /**
   * Handles the body output
   * @param bodyMatchRules The body match rules to use
   */
  handleBodyOutput(bodyMatchRules: BodyRule[]) {
    if (!!bodyMatchRules) {
      this.logger.debug('Set the body match rules to', bodyMatchRules);
      this.bodyMatchRules = bodyMatchRules;
    }
  }

}
