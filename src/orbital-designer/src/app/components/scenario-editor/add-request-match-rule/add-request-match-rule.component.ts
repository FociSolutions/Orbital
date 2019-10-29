import { Component, OnInit, Input, Output } from '@angular/core';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';

@Component({
  selector: 'app-add-request-match-rule',
  templateUrl: './add-request-match-rule.component.html',
  styleUrls: ['./add-request-match-rule.component.scss']
})
export class AddRequestMatchRuleComponent implements OnInit {
  @Input() requestMatchRule: RequestMatchRule;
  @Input() saveStatus: boolean;
  @Output() isValid = true;
  @Output() requestMatchRuleOutput: RequestMatchRule;

  panelExpanded: boolean;
  constructor() {}

  ngOnInit() {
  }

  /**
   * Checks if the panel is valid; if it is not, then it will not allow the panel to close
   */
  canClose() {
    return !this.isValid;
  }

}
