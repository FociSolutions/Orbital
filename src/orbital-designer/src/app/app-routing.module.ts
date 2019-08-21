import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewRedirectService } from './services/overview-redirect.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
