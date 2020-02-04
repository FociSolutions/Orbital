import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-url-add-rule',
  templateUrl: './url-add-rule.component.html',
  styleUrls: ['./url-add-rule.component.scss']
})
export class UrlAddRuleComponent implements OnInit {
  private urlRuleInEdit = {
    rule: { urlPath: '' } as Record<string, string>,
    type: RuleType.ACCEPTALL
  } as KeyValuePairRule;

  @Output() urlRuleAddedEventEmitter = new EventEmitter<KeyValuePairRule>();

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  urlAddRuleFormGroup: FormGroup;

  ngOnInit() {
    this.urlAddRuleFormGroup = new FormGroup({
      path: new FormControl(this.urlRuleInEdit.rule['urlPath'], [
        Validators.required,
        Validators.maxLength(3000)
      ]),
      ruleType: new FormControl(this.urlRuleInEdit.type, [Validators.required])
    });

    this.urlAddRuleFormGroup.get('path').valueChanges.subscribe(path => {
      this.urlRuleInEdit.rule['urlPath'] = path;
    });

    this.urlAddRuleFormGroup.get('ruleType').valueChanges.subscribe(type => {
      this.urlRuleInEdit.type = type;

      if (type === RuleType.ACCEPTALL) {
        this.path.disable();
        this.path.setValue('');
      } else {
        this.path.enable();
      }
    });

    this.path.disable();
  }

  get path() {
    return this.urlAddRuleFormGroup.get('path');
  }

  get ruleType() {
    return this.urlAddRuleFormGroup.get('ruleType');
  }

  addUrlRule() {
    if (this.urlAddRuleFormGroup.valid) {
      this.urlRuleAddedEventEmitter.emit(this.urlRuleInEdit);
    }
  }
}
