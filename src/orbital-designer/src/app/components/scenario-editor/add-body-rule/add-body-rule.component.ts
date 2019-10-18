import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { extendBuiltInValidatorFactory } from 'src/app/validators/extend-built-in-validator-factory/extend-built-in-validator-factory';
import { openApiFileValidator } from 'src/app/validators/open-api-file-validator/open-api-file-validator';
import { NGXLogger } from 'ngx-logger';
import { jsonValidator } from 'src/app/validators/json-validator/json-validator';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  public addBodyRuleFormGroup: FormGroup;
  constructor(logger: NGXLogger) {
    this.addBodyRuleFormGroup = new FormGroup({
      bodyType: new FormControl(
        '',
        extendBuiltInValidatorFactory(
          Validators.compose([Validators.required]),
          logger
        )
      ),
      bodyValue: new FormControl()
    });

    // ensure that the body value is valid JSON
    this.addBodyRuleFormGroup.get('bodyValue').setValidators([
      Validators.required,
      jsonValidator()
    ]);
  }

  ngOnInit() {}
}
