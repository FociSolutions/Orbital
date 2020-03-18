import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-request-match-rule',
  templateUrl: './add-request-match-rule.component.html',
  styleUrls: ['./add-request-match-rule.component.scss']
})
export class AddRequestMatchRuleComponent implements OnInit {
  @Input() requestMatchRule: RequestMatchRule;
  @Output() requestMatchRuleOutput: EventEmitter<RequestMatchRule>;
  @Input() requestMatchRuleFormGroup: FormGroup;

  bodyMatchRules: BodyRule[];

  shouldSave: boolean;
  panelExpanded: boolean;
  isCardDisabled: boolean;
  constructor() {
    this.requestMatchRuleOutput = new EventEmitter<RequestMatchRule>();
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
}
