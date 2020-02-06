import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import {
  recordFirstOrDefaultKey,
  recordFirstOrDefault,
  recordAdd
} from '../../../../models/record';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-url-list-item-rule-type',
  templateUrl: './url-list-item-rule-type.component.html',
  styleUrls: ['./url-list-item-rule-type.component.scss']
})
export class UrlListItemRuleTypeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private currentUrlRuleToEdit = {
    rule: { urlPath: '' } as Record<string, string>,
    type: RuleType.ACCEPTALL
  } as KeyValuePairRule;

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' }
  ];

  urlEditRuleFormGroup: FormGroup;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() urlRuleRemovedEventEmitter = new EventEmitter<KeyValuePairRule>();

  @Input()
  set kvp(input: KeyValuePairRule) {
    if (input) {
      this.currentUrlRuleToEdit = input;
    }
  }

  ngOnInit() {
    this.urlEditRuleFormGroup = new FormGroup({
      path: new FormControl(
        recordFirstOrDefault(this.currentUrlRuleToEdit.rule, 'urlPath'),
        [Validators.required, Validators.maxLength(3000)]
      ),
      ruleType: new FormControl(this.currentUrlRuleToEdit.type, [
        Validators.required
      ])
    });
    const pathSubscription = this.urlEditRuleFormGroup
      .get('path')
      .valueChanges.subscribe(path => {
        recordAdd(
          this.currentUrlRuleToEdit.rule,
          recordFirstOrDefaultKey(this.currentUrlRuleToEdit.rule, 'urlPath'),
          path
        );
      });

    const ruleTypeSubscription = this.urlEditRuleFormGroup
      .get('ruleType')
      .valueChanges.subscribe(type => {
        this.currentUrlRuleToEdit.type = type;

        if (type === RuleType.ACCEPTALL) {
          this.path.disable();
          this.path.setValue('');
        } else {
          this.path.enable();
        }
      });

    if (this.currentUrlRuleToEdit.type === RuleType.ACCEPTALL) {
      this.path.disable();
    }

    this.subscriptions.push(pathSubscription, ruleTypeSubscription);
  }

  /**
   * Gets the form control for the 'path'
   */
  get path(): AbstractControl {
    return this.urlEditRuleFormGroup.get('path');
  }

  /**
   * Gets the value from the current url rule type
   */

  get ruleType(): AbstractControl {
    return this.urlEditRuleFormGroup.get('ruleType');
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    this.urlRuleRemovedEventEmitter.emit(this.currentUrlRuleToEdit);
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
