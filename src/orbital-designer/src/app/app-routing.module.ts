import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewRedirectService } from './services/overview-redirect.service';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CreateNewMockViewComponent } from './components/create-new-mock-view/create-new-mock-view.component';
import { ImportFromFileComponent } from './components/import-from-file/import-from-file.component';

const routes: Routes = [
  { path: '', component: HomeViewComponent },
  { path: 'create-new-mock', component: CreateNewMockViewComponent },
  { path: 'import-from-file', component: ImportFromFileComponent },
  { path: '**', component: HomeViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
