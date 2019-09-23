import { Component, OnInit } from '@angular/core';
import { DesignerStore} from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { EndpointListItemComponent} from '../endpoint-list-item/endpoint-list-item.component';

@Component({
  selector: 'app-endpoint-view',
  templateUrl: './endpoint-view.component.html',
  styleUrls: ['./endpoint-view.component.scss']
})
export class EndpointViewComponent implements OnInit {

  constructor(private store: DesignerStore) {
    this.store.state$.subscribe(
      state => (
        this.mockDefinition = state.mockDefinition
      )
    );
  }

  mockDefinition: MockDefinition;

  ngOnInit() {
  }

}
