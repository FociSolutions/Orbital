import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent {

  constructor(private router: Router,
              private store: DesignerStore) {
    this.store.state$.subscribe(state => {
      this.checkMockDefinitions(state.mockDefinitions);
    });
  }

  checkMockDefinitions(mockDefs: Record<string, MockDefinition>) {
    if (Object.keys(mockDefs).length > 0) {
      this.navigateTo('/endpoint-view');
    }
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

}
