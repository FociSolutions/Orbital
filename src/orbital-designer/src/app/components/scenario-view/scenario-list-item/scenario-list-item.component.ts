import { Component, OnInit, Input } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';

@Component({
  selector: 'app-scenario-list-item',
  templateUrl: './scenario-list-item.component.html',
  styleUrls: ['./scenario-list-item.component.scss']
})
export class ScenarioListItemComponent implements OnInit {
  private store: DesignerStore;
  @Input() scenario: Scenario;

  constructor(private designerStore: DesignerStore, private logger: NGXLogger) {
    this.store = designerStore;
  }

  ngOnInit() {}
}
