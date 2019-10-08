import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.scss']
})
export class ScenarioEditorComponent implements OnInit {
  formGroup: FormGroup;
  name: FormControl;
  description: FormControl;

  constructor(private router: Router) {
      this.name = new FormControl(
        '',
          Validators.compose([Validators.maxLength(50), Validators.required]));

      this.description = new FormControl(
        '',
          Validators.compose([Validators.maxLength(50)])
      );
  }

  ngOnInit() {
  }

  /**
   * Goes back to the scenarios view
   */
  goToScenarios() {
    this.router.navigateByUrl('scenario-view');
  }
}
