import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DesignerStore } from '../../store/designer-store';

@Injectable({
  providedIn: 'root',
})

/**
 * Redirects to the homepage if the user goes to an internal route which requires
 * a mock definition to be loaded
 */
export class OverviewRedirectService {
  constructor(private store: DesignerStore, private router: Router) {}

  /**
   * Navigates to the homepage if the mock definition store is not initialized;
   * always returns true
   */
  canActivate() {
    if (!this.store.state.mockDefinition) {
      this.router.navigate(['/']);
    }
    return true;
  }
}
