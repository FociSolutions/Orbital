import { Component, OnInit } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';

@Component({
  selector: 'app-url-list-item-rule-type',
  templateUrl: './url-list-item-rule-type.component.html',
  styleUrls: ['./url-list-item-rule-type.component.scss']
})
export class UrlListItemRuleTypeComponent implements OnInit {
  type: RuleType;
  rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  constructor() {}

  ngOnInit() {}
}
