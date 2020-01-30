import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { recordMap } from 'src/app/models/record';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  mockDefinitions: MockDefinition[];
  selectedMockDefinition: string;
  title = 'MOCK DEFINITIONS';

  triggerOpenConfirmBox: boolean;

  mockDefinitionToBeDismissed: MockDefinition;

  constructor(
    private store: DesignerStore,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.store.state$.subscribe(state => {
      if (!!state.mockDefinition) {
        this.mockDefinitions = recordMap(state.mockDefinitions, md => md);
        this.selectedMockDefinition = state.mockDefinition.metadata.title;
      }
    });
  }

  // Pass a string title value selected and set it to the string title.
  isSelected(title: string): boolean {
    if (this.selectedMockDefinition === null) {
      return false;
    }
    return title === this.selectedMockDefinition;
  }

  // Updates the value of the mock definition after selecting it.
  // this.store.mockDefinition is set and then the state updated.
  updateSelected(mockDefinition: MockDefinition) {
    this.store.mockDefinition = mockDefinition;
    this.router.navigateByUrl('endpoint-view');
  }

  /**
   * Dismisses a Mockdefinition from the side bar view and removes it from the store
   * Navigates back to homepage if the last mockdefinition is dismissed
   */
  onDismiss(mockDefinition: MockDefinition) {
    this.store.deleteMockDefinitionByTitle(mockDefinition.metadata.title);
    this.logger.info('Mockdefinition Dismissed', mockDefinition);
    if (this.mockDefinitions.length <= 0) {
      this.router.navigate(['/']);
    } else {
      this.router.navigateByUrl('endpoint-view');
    }
  }

  /**
   * Handles the response from the confirm box
   * @param shouldConfirm The button pressed for the cancel box
   */
  onConfirmDialogAction(shouldConfirm: boolean) {
    if (shouldConfirm) {
      this.onDismiss(this.mockDefinitionToBeDismissed);
      this.logger.debug('The user has confirmed Mockdefinition deletion');
    } else {
      this.logger.debug('The user has canceled Mockdefinition deletion');
    }
    this.triggerOpenConfirmBox = false;
  }
  ngOnInit() {}

  /**
   * Opens the dialog box for the Mockdefinition to be dismissed
   * @param mockDefinition The Mockdefinition to be dismissed
   */
  openDialogBox(mockDefinition: MockDefinition) {
    this.mockDefinitionToBeDismissed = mockDefinition;
    this.triggerOpenConfirmBox = true;
  }
}
