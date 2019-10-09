import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.scss']
})
export class ScenarioEditorComponent implements OnInit {
  nameAndDescriptionFormGroup: FormGroup;
  name: FormControl;
  description: FormControl;
  nameDescriptionPanelExpanded: boolean;

  responseFormGroup: FormGroup;
  requestMatchRulesPanelExpanded: boolean;

  constructor(private router: Router) {
    this.nameAndDescriptionFormGroup = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([Validators.maxLength(50), Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.maxLength(50)])
      )
    });

    this.responseFormGroup = new FormGroup({
      status: new FormGroup({
        statuscode: new FormControl()
      }),
      headers: new FormGroup({
        headerToAdd: new FormGroup({
          key: new FormControl(),
          value: new FormControl()
        }),
        headersAdded: new FormGroup({
          key: new FormControl(),
          value: new FormControl()
        })
      }),
      body: new FormGroup({
        bodyContent: new FormControl()
      })
    });
  }

  ngOnInit() {}

  /**
   * Goes back to the scenarios view
   */
  goToScenarios() {
    this.router.navigateByUrl('scenario-view');
  }

  /**
   * Sets the state of the panel to collapsed when cancel is clicked
   */
  handleCancelButtonClick() {
    this.nameDescriptionPanelExpanded = false;
  }

  /**
   * Sets the state of the panel to collapsed when save is clicked.
   * Currently, this method is identical to handleCancelButtonClick but will
   * contain save functionality later.
   */
  handleSaveButtonClick() {
    this.nameDescriptionPanelExpanded = false;
  }

  /**
   * Sets the state of the panel to open
   */
  handleNameDescriptionPanelOpen() {
    this.nameDescriptionPanelExpanded = true;
  }

  /**
   * Returns whether the save button should be disabled based on the form's validity
   */
  saveButtonDisabledState() {
    if (!!this.nameAndDescriptionFormGroup &&
      this.nameAndDescriptionFormGroup.controls.name !== undefined &&
      this.nameAndDescriptionFormGroup.controls.description !== undefined) {
      return this.nameAndDescriptionFormGroup.controls.name.invalid || this.nameAndDescriptionFormGroup.controls.description.invalid;
    }

    return true;
  }

  /**
   * Handles when the panel is manually closed (by clicking the header.)
   */
  handleNameDescriptionPanelClose() {
    this.nameDescriptionPanelExpanded = false;
  }

  handleRequestMatchRulesPanelOpen() {
    this.requestMatchRulesPanelExpanded = false;
  }

  handleRequestMatchRulesPanelClose() {
    this.requestMatchRulesPanelExpanded = false;
  }


}
