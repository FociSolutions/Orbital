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

  isSelected(title: string): boolean {
    if (this.selectedMockDefinition === null) {

    }
    return title === this.selectedMockDefinition;
  }

  updateSelected(mockDefinition: MockDefinition) {
    this.store.mockDefinition = mockDefinition;
  }
  ngOnInit() {
  }

}
