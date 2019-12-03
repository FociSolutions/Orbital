import { Component, OnInit } from '@angular/core';
import { DesignerStore } from '../../../store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Router, ActivatedRoute } from '@angular/router';
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
   * Dismisses a Mockdefinition from the Designer view
   * Navigates back to homepage if the last mockdefinition is dismissed
   */
  onDismiss(mockDefinition: KeyValue<string, MockDefinition>) {
    this.mockDefinitions.delete(mockDefinition.key);
    this.logger.info('Mockdefinition Dismissed', mockDefinition);
    if (this.mockDefinitions.size <= 0) {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {}
}
