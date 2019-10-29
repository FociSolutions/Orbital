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

}
