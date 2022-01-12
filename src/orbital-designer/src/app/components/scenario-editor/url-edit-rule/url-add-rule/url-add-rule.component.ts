import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-url-add-rule',
  templateUrl: './url-add-rule.component.html',
  styleUrls: ['./url-add-rule.component.scss'],
})
export class UrlAddRuleComponent implements OnInit, OnDestroy {
  /**
   * Stores the subscriptions that will be destroyed during OnDestroy
   */
  private subscriptions: Subscription[] = [];
  private urlRuleInEdit: KeyValuePairRule = {
    rule: { urlPath: '' },
    type: RuleType.ACCEPTALL,
  };
  private ruleIsDuplicated = false;

  @Input() urlRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() urlRuleAddedEventEmitter = new EventEmitter<KeyValuePairRule>();

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
  ];

  urlAddRuleFormGroup: FormGroup;
  ngOnInit() {
    const urlDuplicatedSubscription = this.urlRuleAddedIsDuplicated.subscribe(
      (isDuplicated) => (this.ruleIsDuplicated = isDuplicated)
    );
    this.urlAddRuleFormGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      path: new FormControl(this.urlRuleInEdit.rule.urlPath, [Validators.required, Validators.maxLength(3000)]),
      ruleType: new FormControl(this.urlRuleInEdit.type, [Validators.required]),
    });

    const pathSubscription = this.urlAddRuleFormGroup.get('path').valueChanges.subscribe((path) => {
      this.ruleIsDuplicated = false;
      this.urlRuleInEdit.rule.urlPath = path;
    });

    const ruleTypeSubscription = this.urlAddRuleFormGroup.get('ruleType').valueChanges.subscribe((type) => {
      this.ruleIsDuplicated = false;
      this.urlRuleInEdit.type = type;

      if (type === RuleType.ACCEPTALL) {
        this.path.disable();
        this.path.setValue('');
      } else {
        this.path.enable();
      }
    });

    this.subscriptions.push(pathSubscription, ruleTypeSubscription, urlDuplicatedSubscription);
    this.path.disable();
  }

  /**
   *
   * Gets the boolean indicating if the rule to be added is duplicated.
   */
  get isRuleDuplicated(): boolean {
    return this.ruleIsDuplicated;
  }
  /**
   * Gets the form control for the 'path'
   */
  get path(): AbstractControl {
    return this.urlAddRuleFormGroup.get('path');
  }

  /**
   * Gets the form control for the 'ruleType'
   */
  get ruleType(): AbstractControl {
    return this.urlAddRuleFormGroup.get('ruleType');
  }

  /**
   * Controls the logic for emitting a new addUrlRule event
   */
  addUrlRule(): void {
    if (this.urlAddRuleFormGroup.valid) {
      this.urlRuleAddedEventEmitter.emit(this.urlRuleInEdit);
    }
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
