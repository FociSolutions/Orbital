import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UrlRule } from 'src/app/models/mock-definition/scenario/url-rule.model';

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
  private urlRuleInEdit: UrlRule = {
    path: '',
    type: RuleType.ACCEPTALL,
  };
  private ruleIsDuplicated = false;

  @Input() readonly PATH_MAXLENGTH = 3000;
  @Input() urlRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() urlRuleAddedEventEmitter = new EventEmitter<UrlRule>();

  readonly rules = [RuleType.REGEX, RuleType.ACCEPTALL, RuleType.TEXTEQUALS];

  urlAddRuleFormGroup: FormGroup;
  ngOnInit() {
    const urlDuplicatedSubscription = this.urlRuleAddedIsDuplicated.subscribe(
      (isDuplicated) => (this.ruleIsDuplicated = isDuplicated)
    );
    this.urlAddRuleFormGroup = new FormGroup({
      path: new FormControl(this.urlRuleInEdit.path, [Validators.required, Validators.maxLength(this.PATH_MAXLENGTH)]),
      type: new FormControl(this.urlRuleInEdit.type, [Validators.required]),
    });

    const pathSubscription = this.urlAddRuleFormGroup.get('path').valueChanges.subscribe((path: string) => {
      this.ruleIsDuplicated = false;
      this.urlRuleInEdit.path = path;
    });

    const ruleTypeSubscription = this.urlAddRuleFormGroup.get('type').valueChanges.subscribe((type: RuleType) => {
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
   * Gets the form control for the 'type'
   */
  get type(): AbstractControl {
    return this.urlAddRuleFormGroup.get('type');
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
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
