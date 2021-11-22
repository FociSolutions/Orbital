import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { TokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';

@Component({
  selector: 'app-add-token-validation-rule',
  templateUrl: './add-token-validation-rule.component.html',
  styleUrls: ['./add-token-validation-rule.component.scss'],
})
export class AddTokenValidationRuleComponent implements OnInit {
  formSubscription: Subscription;
  @Input() tokenRule: TokenRule;
  @Input() tokenRuleFormArray: FormArray;
  checkExpiration: boolean;

  constructor() {}

  ngOnInit(): void {
    this.checkExpiration = this.tokenRule.checkExpired;

    this.formSubscription = this.tokenRuleFormArray.valueChanges.subscribe(() => {
      this.updateTokenRule();
    });
  }

  toggleExpiration($event) {
    this.checkExpiration = $event.checked;
    this.updateTokenRule();
  }

  updateTokenRule() {
    this.tokenRule.checkExpired = this.checkExpiration;
    const formGroups = this.tokenRuleFormArray.controls;

    this.tokenRule.rules = formGroups.map((formGroup) => {
      let kvpRule: Record<string, string> = {};
      kvpRule[formGroup.get('key').value] = formGroup.get('value').value;
      return {
        type: formGroup.get('type').value,
        rule: kvpRule,
      } as KeyValuePairRule;
    });
  }
}
