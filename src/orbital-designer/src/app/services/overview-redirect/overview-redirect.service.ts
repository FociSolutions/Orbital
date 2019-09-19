import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DesignerStore } from '../../store/designer-store';

@Injectable({
  providedIn: 'root'
})
export class OverviewRedirectService implements CanActivate {
  constructor(private store: DesignerStore, private router: Router) {}

  canActivate() {
    if (!this.store.state.mockDefinition) {
      this.router.navigate(['/']);
    }
    return true;
  }
}
