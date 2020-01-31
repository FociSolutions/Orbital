import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-url-add-rule',
  templateUrl: './url-add-rule.component.html',
  styleUrls: ['./url-add-rule.component.scss']
})
export class UrlAddRuleComponent implements OnInit {
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePairRule>();

  // The key and value properties that were bound to the template
  private key = 'urlPath';
  value: string;
  isValid: boolean;
  errorMessage: string;

  ruleType: RuleType;
  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.value = '';
    this.isValid = true;
    this.errorMessage = '';
  }

  /**
   * Checks to see if the kvp key is not empty and adds it if it is not empty
   */
  onAdd() {
    if (!this.isValueEmpty() && !this.isRuleTypeEmpty()) {
      if (this.ruleTypeisAcceptAll()) {
        this.value = '';
      }
      const kvpAdd = {
        type: this.ruleType,
        rule: {
          [this.key]: this.value
        }
      } as KeyValuePairRule;

      this.kvp.emit(kvpAdd);
      this.isValid = true;
      this.value = '';
      this.logger.debug('KvpAddComponent:onAdd: KVP emitted to parent', kvpAdd);
    } else {
      this.isValid = false;
    }
  }

  /**
   * Returns true if the value field is empty and false otherwise
   */
  private isValueEmpty(): boolean {
    if (
      this.value.trim().length === 0 &&
      this.ruleType !== RuleType.ACCEPTALL
    ) {
      this.errorMessage = 'Empty Value Field Found: Please Enter Value';
      this.logger.debug('Empty Value Field Found: Please Enter Value');
      return true;
    }
    return false;
  }

  /*
   * Returns true if the compareType is empty
   */
  private isRuleTypeEmpty(): boolean {
    if (this.ruleType === undefined) {
      this.errorMessage =
        'Empty Compare Type: Please Select a valid compare type';
      this.logger.debug(
        'Empty Compare Type: Please Select a valid compare type'
      );
      return true;
    }

    return false;
  }

  /**
   * This will return true if the rule type is AcceptAll. false otherwise.
   */
  ruleTypeisAcceptAll(): boolean {
    return this.ruleType === RuleType.ACCEPTALL;
  }
}
