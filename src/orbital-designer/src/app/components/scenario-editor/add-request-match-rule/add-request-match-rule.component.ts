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
  @Output() isValid: boolean;

  panelExpanded: boolean;
  constructor() {}

  ngOnInit() {
  }

}
