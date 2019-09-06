import { Component, OnInit, Input } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-rest-request-input",
  templateUrl: "./rest-request-input.component.html",
  styleUrls: ["./rest-request-input.component.scss"]
})
export class RestRequestInputComponent implements OnInit {
  @Input() buttonName: string;

  ngOnInit() {
    if (!!this.buttonName) {
      this.buttonName = "Submit";
    }
  }
  formGroup: FormGroup;
  constructor(private router: Router, private location: Location) {
    const urlPattern = /^(http[s]?:\/\/)/;
    this.formGroup = new FormGroup({
      uri: new FormControl(
        "",
        Validators.compose([
          Validators.maxLength(2048),
          Validators.required,
          Validators.pattern(urlPattern)
        ])
      )
    });
  }

  errorMessage(controlkey: string): string {
    const errors = this.formGroup.controls[controlkey].errors;
    if (!errors) {
      return "";
    }

    const errorMessages = {
      required: `${controlkey} is required`,
      maxlength: "Max characters exceeded"
    };

    const errorMessage = Object.keys(errors)
      .map(err => (!!errorMessages[err] ? errorMessages[err] : "Invalid Input"))
      .join("\n");

    return errorMessage.trim();
  }
}
