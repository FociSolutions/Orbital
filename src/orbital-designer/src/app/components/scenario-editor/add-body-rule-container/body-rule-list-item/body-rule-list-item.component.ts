import { Component, OnInit } from '@angular/core';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';

@Component({
  selector: 'app-body-rule-list-item',
  templateUrl: './body-rule-list-item.component.html',
  styleUrls: ['./body-rule-list-item.component.scss']
})
export class BodyRuleListItemComponent implements OnInit {
  bodyRuleTypeValues = BodyRuleType;
  bodyType: BodyRuleType;

  constructor() { }

  ngOnInit() {
  }

  deleteBodyRule() {

  }
}
