import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-request-match-rule',
  templateUrl: './add-request-match-rule.component.html',
  styleUrls: ['./add-request-match-rule.component.scss']
})
export class AddRequestMatchRuleComponent implements OnInit {
  @Input() requestMatchRule: RequestMatchRule;
  @Input() saveStatus = true;
  @Output() isValid: EventEmitter<boolean>;
  @Output() requestMatchRuleOutput: EventEmitter<RequestMatchRule>;
  panelExpanded: boolean;
  headerMatchRules: Map<string, string>;
  queryMatchRules: Map<string, string>;
  constructor(private logger: NGXLogger) {
    this.isValid = new EventEmitter<boolean>();
    this.requestMatchRuleOutput = new EventEmitter<RequestMatchRule>();
  }

  ngOnInit() {
  }

  /**
   * Checks if the panel is valid; if it is not, then it will not allow the panel to close
   */
  cannotClose() {
    this.logger.debug('User clicked to close panel');
    return !this.saveStatus;
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

}
