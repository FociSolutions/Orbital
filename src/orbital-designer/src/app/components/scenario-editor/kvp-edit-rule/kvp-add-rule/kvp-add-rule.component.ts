import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';

@Component({
  selector: 'app-kvp-add-rule',
  templateUrl: './kvp-add-rule.component.html',
  styleUrls: ['./kvp-add-rule.component.scss']
})
export class KvpAddRuleComponent implements OnInit {
  @Input() kvpAddedError: EventEmitter<boolean>;
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePairRule>();

  // The key and value properties that were bound to the template
  key: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  ruleIsDuplicated: boolean;

  ruleType: RuleType;
  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.key = '';
    this.value = '';
    this.isValid = true;
    this.errorMessage = '';
    this.ruleIsDuplicated = false;

    if (!!this.kvpAddedError) {
      this.kvpAddedError.subscribe((e: boolean) => {
        this.ruleIsDuplicated = e;
        if (!e) {
          this.key = '';
          this.value = '';
        }
      });
    }
  }

  /**
   * Checks to see if the kvp key is not empty and adds it if it is not empty
   */
  onAdd() {
    if (!this.isKeyEmpty() && !this.isRegexEmpty() && !this.isRuleTypeEmpty()) {
      const kvpAdd = {
        type: this.ruleType,
        rule: {
          [this.key]: this.value
        }
      } as KeyValuePairRule;

      this.kvp.emit(kvpAdd);
      this.logger.debug('KvpAddComponent:onAdd: KVP emitted to parent', kvpAdd);
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  /**
   * Returns true if the key field is empty and false otherwise
   */
  isKeyEmpty(): boolean {
    if (this.key.trim().length === 0) {
      this.errorMessage = 'Empty Key Field Found: Please Enter Value';
      this.logger.debug('Empty Key Field Found: Please Enter Value');
      return true;
    }

    return false;
  }

  /**
   * Returns true if the value for the Regex rule type is empty and false otherwise
   */
  isRegexEmpty(): boolean {
    if (!this.value && this.ruleType === RuleType.REGEX) {
      this.errorMessage = 'A Regex Value Must be Entered';
      return true;
    } else {
      return false;
    }
  }

  /*
   * Returns true if the compareType is empty
   */
  isRuleTypeEmpty(): boolean {
    if (this.ruleType === undefined) {
      this.errorMessage = 'Empty Compare Type: Please Select a valid compare type';
      this.logger.debug('Empty Compare Type: Please Select a valid compare type');
      return true;
    }

    return false;
  }
}
