import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MockDefinitionStore } from '../store/mockdefinitionstore';

@Injectable({
  providedIn: 'root'
})
export class OverviewRedirectService implements CanActivate {
  constructor(
    private mockDefinitionStore: MockDefinitionStore,
    private router: Router
  ) {}

  canActivate() {
    if (!this.mockDefinitionStore.state.metadata) {
      this.router.navigate(['/']);
    }
    return true;
  }
}
