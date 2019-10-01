import { Component, OnInit } from '@angular/core';
import { DesignerStore } from '../../store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  mockDefinitions: Map<string, MockDefinition>;
  selectedMockDefinition: string;
  title = 'MOCKDEFINITIONS';

  constructor( private store: DesignerStore) {
    this.store.state$.subscribe(state => {
      this.mockDefinitions = state.mockDefinitions;
      this.selectedMockDefinition = state.mockDefinition.metadata.title;
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
  }
  ngOnInit() {
  }

}
