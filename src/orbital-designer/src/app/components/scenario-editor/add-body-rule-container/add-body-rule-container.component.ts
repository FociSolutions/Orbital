import { Component, OnInit, Input, Output } from '@angular/core';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

@Component({
  selector: 'app-add-body-rule-container',
  templateUrl: './add-body-rule-container.component.html',
  styleUrls: ['./add-body-rule-container.component.scss']
})
export class AddBodyRuleContainerComponent implements OnInit {
  @Input() bodyRules: BodyRule[];
  @Output() bodyRulesOutput: BodyRule[];

  ngOnInit() {
  }

}
