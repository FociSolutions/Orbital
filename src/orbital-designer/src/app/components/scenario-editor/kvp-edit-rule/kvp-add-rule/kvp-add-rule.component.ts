import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { recordUpdateKeyName } from 'src/app/models/record';

@Component({
  selector: 'app-kvp-add-rule',
  templateUrl: './kvp-add-rule.component.html',
  styleUrls: ['./kvp-add-rule.component.scss'],
})
export class KvpAddRuleComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  private hasOldKey = false;
  @Input() kvpAddedError = new EventEmitter<boolean>();
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePairRule>();

  private kvpRuleInEdit: KeyValuePairRule = {
    rule: {},
    type: RuleType.NONE,
  };
  isValid: boolean;
  errorMessage: string;
  ruleIsDuplicated: boolean;

  kvpAddRuleFormGroup: FormGroup;
  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
  ];

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.kvpAddRuleFormGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      ruleKey: new FormControl('', [Validators.required, Validators.maxLength(200), this.noWhiteSpaceValidator]),
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      ruleValue: new FormControl('', [Validators.required, Validators.maxLength(3000)]),
      type: new FormControl(RuleType.NONE, [Validators.required]),
    });

    const ruleDuplicatedSubscription = this.kvpAddedError.subscribe(
      (isDuplicated) => (this.ruleIsDuplicated = isDuplicated)
    );

    const keySubscription = this.kvpAddRuleFormGroup.get('ruleKey').valueChanges.subscribe((newKey) => {
      this.ruleIsDuplicated = false;
      const oldKey = this.kvpAddRuleFormGroup.value.ruleKey;
      if (this.hasOldKey) {
        recordUpdateKeyName(this.kvpRuleInEdit.rule, oldKey, newKey);
      } else {
        this.kvpRuleInEdit.rule[newKey] = this.kvpAddRuleFormGroup.get('ruleValue').value;
        this.hasOldKey = true;
      }
    });

    const valueSubscription = this.kvpAddRuleFormGroup.get('ruleValue').valueChanges.subscribe((value) => {
      this.ruleIsDuplicated = false;
      this.kvpRuleInEdit.rule[this.ruleKey.value] = value;
    });

    const ruleSubscription = this.kvpAddRuleFormGroup.get('type').valueChanges.subscribe((type) => {
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
      this.errorMessage = this.ruleKeyError?.error ?? '';
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

  get ruleKeyError(): ValidationErrors {
    return this.kvpAddRuleFormGroup.get('ruleKey').errors;
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

  /**
   * Matches against whitespace regex
   * @param control the form control
   * @returns an error message or null
   */
  noWhiteSpaceValidator(this: void, control: AbstractControl): ValidationErrors {
    let error = null;
    if (/\s/.test(control.value)) {
      error = { error: 'Cannot contain whitespace' };
    }
    return error;
  }
}
