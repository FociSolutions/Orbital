import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { recordFirstOrDefault } from 'src/app/models/record';

@Injectable({
  providedIn: 'root'
})
export class PolicyFormBuilder {
  constructor(private formBuilder: FormBuilder) {}

  /**
   * This method will return you the metadata provided as a form group.
   *
   * @param metadata The metadata information to be turned to a form group.
   */
  public generateDelayPolicyFormGroup(): FormGroup {
    return this.formBuilder.group({
      delayTime: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')])
    });
  }

  public generateEmptyPolicyFormArray(): FormArray {
    return this.formBuilder.array([]);
  }
}
