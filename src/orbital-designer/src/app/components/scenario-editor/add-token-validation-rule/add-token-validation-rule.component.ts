import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  ngOnInit(): void {
    this.formSubscription = this.tokenRuleFormArray.valueChanges.subscribe(() => {
      this.updateTokenRule();
    });
  }

  updateTokenRule() {
    const formGroups = this.tokenRuleFormArray.controls;

    this.tokenRule.rules = formGroups.map((formGroup) => {
      const kvpRule: Record<string, string> = {};
      kvpRule[formGroup.get('key').value] = formGroup.get('value').value;
      return {
        type: formGroup.get('type').value,
        rule: kvpRule,
      };
    });
  }
}
