import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { recordUpdateKeyName } from 'src/app/models/record';
import { pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-kvp-add-rule',
  templateUrl: './kvp-add-rule.component.html',
  styleUrls: ['./kvp-add-rule.component.scss']
})
export class KvpAddRuleComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @Input() kvpAddedError = new EventEmitter<boolean>();
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePairRule>();

  private kvpRuleInEdit = {
    rule: {} as Record<string, string>,
    type: RuleType.NONE
  } as KeyValuePairRule;
  isValid: boolean;
  errorMessage: string;
  ruleIsDuplicated: boolean;

  kvpAddRuleFormGroup: FormGroup;
  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.kvpAddRuleFormGroup = new FormGroup({
      ruleKey: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      ruleValue: new FormControl('', [Validators.required, Validators.maxLength(3000)]),
      type: new FormControl(RuleType.NONE, [Validators.required])
    });
    const ruleDuplicatedSubscription = this.kvpAddedError.subscribe(
      isDuplicated => (this.ruleIsDuplicated = isDuplicated)
    );
    const keySubscription = this.kvpAddRuleFormGroup.get('ruleKey').valueChanges.subscribe(newKey => {
      this.ruleIsDuplicated = false;
      const oldKey = this.kvpAddRuleFormGroup.value['ruleKey'];
      if (oldKey) {
        recordUpdateKeyName(this.kvpRuleInEdit.rule, oldKey, newKey);
      } else {
        this.kvpRuleInEdit.rule[newKey] = this.kvpAddRuleFormGroup.get('ruleValue').value;
      }
    });
    const valueSubscription = this.kvpAddRuleFormGroup.get('ruleValue').valueChanges.subscribe(value => {
      this.ruleIsDuplicated = false;
      this.kvpRuleInEdit.rule[this.ruleKey.value] = value;
    });
    const ruleSubscription = this.kvpAddRuleFormGroup.get('type').valueChanges.subscribe(type => {
      this.ruleIsDuplicated = false;
      if (!this.ruleValue && this.ruleType.value === RuleType.REGEX) {
        this.errorMessage = 'A Regex Value Must be Entered';
      } else if (this.ruleType.value === undefined || this.ruleType.value === RuleType.NONE) {
        this.errorMessage = 'Empty Compare Type: Please Select a valid compare type';
        this.logger.debug('Empty Compare Type: Please Select a valid compare type');
      }
      this.kvpRuleInEdit.type = type;
    });
    this.subscriptions.push(keySubscription, valueSubscription, ruleSubscription, ruleDuplicatedSubscription);
  }

  /**
   * Checks to see if the kvp key is not empty and adds it if it is not empty
   */
  onAdd() {
    if (!this.isKeyEmpty() && this.kvpAddRuleFormGroup.valid) {
      this.kvp.emit(this.kvpRuleInEdit);
      this.logger.debug('KvpAddComponent:onAdd: KVP emitted to parent', this.kvpRuleInEdit);
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  /**
   * Gets the form control for the 'key'
   */
  get ruleKey(): AbstractControl {
    return this.kvpAddRuleFormGroup.get('ruleKey');
  }

  get ruleValue(): AbstractControl {
    return this.kvpAddRuleFormGroup.get('ruleValue');
  }

  get ruleType(): AbstractControl {
    return this.kvpAddRuleFormGroup.get('type');
  }

  /**
   * Returns true if the key field is empty and false otherwise
   */
  isKeyEmpty(): boolean {
    if (this.ruleKey.value.trim().length === 0) {
      this.errorMessage = 'Empty Key Field Found: Please Enter Value';
      this.logger.debug('Empty Key Field Found: Please Enter Value');
      return true;
    }

    return false;
  }
}
