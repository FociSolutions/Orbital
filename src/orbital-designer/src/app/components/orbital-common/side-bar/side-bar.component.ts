import { Component, OnInit } from '@angular/core';
import { DesignerStore } from '../../../store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  mockDefinitions: Map<string, MockDefinition>;
  selectedMockDefinition: string;
  title = 'MOCK DEFINITIONS';

  triggerOpenConfirmBox: boolean;

  mockDefinitionToBeDismissed: KeyValue<string, MockDefinition>;

  constructor(
    private store: DesignerStore,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.store.state$.subscribe(state => {
      if (!!state.mockDefinition) {
        this.mockDefinitions = state.mockDefinitions;
        this.selectedMockDefinition = state.mockDefinition.metadata.title;
      }
    });
  }

  /**
   * Pass a string title value selected and set it to the string title.
   * @param title The title
   */
  isSelected(title: string): boolean {
    if (this.selectedMockDefinition === null) {
      return false;
    }
    return title === this.selectedMockDefinition;
  }

  /**
   * Updates the value of the mock definition after selecting it.
   * @param mockDefinition: the new mock definition to select
   */
  updateSelected(mockDefinition: MockDefinition) {
    this.store.mockDefinition = mockDefinition;
    this.router.navigateByUrl('endpoint-view');
  }

  /**
   * Dismisses a Mockdefinition from the side bar view and removes it from the store
   * Navigates back to homepage if the last mockdefinition is dismissed
   */
  onDismiss(mockDefinition: KeyValue<string, MockDefinition>) {
    this.store.deleteMockDefinitionByTitle(mockDefinition.value.metadata.title);
    this.logger.info('Mockdefinition Dismissed', mockDefinition);
    if (!this.mockDefinitions.size) {
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
  openDialogBox(mockDefinition: KeyValue<string, MockDefinition>) {
    this.mockDefinitionToBeDismissed = mockDefinition;
    this.triggerOpenConfirmBox = true;
  }
}
