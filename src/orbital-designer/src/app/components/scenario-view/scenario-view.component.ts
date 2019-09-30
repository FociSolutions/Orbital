import { Component, OnInit } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit {
  constructor(private store: DesignerStore) {
    this.store.state$.subscribe(
      state => (this.mockDefinition = state.mockDefinition)
    );
  }

  mockDefinition: MockDefinition;

  ngOnInit() {}
}
