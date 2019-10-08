import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.scss']
})
export class ScenarioEditorComponent implements OnInit {
  formGroup: FormGroup;
  name: FormControl;
  description: FormControl;
  nameDescriptionPanelExpanded: boolean;

  constructor(private router: Router, private store: DesignerStore) {
      this.name = new FormControl(
        '',
          Validators.compose([Validators.maxLength(50), Validators.required]));

      this.description = new FormControl(
        '',
          Validators.compose([Validators.maxLength(50)])
      );

      this.store.state$.subscribe(state => {
        if (!!state.selectedScenario && !!state.selectedScenario.metadata && !!state.selectedScenario.metadata) {
          this.name.setValue(state.selectedScenario.metadata.title);
          this.description.setValue(state.selectedScenario.metadata.description);
        }
      });
  }

  ngOnInit() {
  }

  /**
   * Goes back to the scenarios view
   */
  goToScenarios() {
    this.router.navigateByUrl('scenario-view');
  }

  /**
   * Sets the state of the panel to collapsed when save (if valid) or cancel is clicked
   */
  handleCancelButtonClick() {
    this.nameDescriptionPanelExpanded = false;
  }

  /**
   * Sets the state of the panel to open
   */
  handleNameDescriptionPanelOpen() {
    this.nameDescriptionPanelExpanded = true;
  }
}
