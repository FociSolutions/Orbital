import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewRedirectService } from './services/overview-redirect/overview-redirect.service';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CreateNewMockViewComponent } from './components/create-new-mock-view/create-new-mock-view.component';
import { ImportFromFileViewComponent } from './components/import-from-file-view/import-from-file-view.component';
import { ImportFromServerViewComponent } from './components/import-from-server-view/import-from-server-view.component';
import { EndpointViewComponent } from './components/endpoint-view/endpoint-view.component';
import { ScenarioViewComponent } from './components/scenario-view/scenario-view.component';
import { ScenarioEditorComponent } from './components/scenario-editor/scenario-editor.component';

const routes: Routes = [
  { path: '', component: HomeViewComponent },
  { path: 'create-new-mock', component: CreateNewMockViewComponent },
  { path: 'import-from-file', component: ImportFromFileViewComponent },
  { path: 'import-from-server', component: ImportFromServerViewComponent },
  {
    path: 'endpoint-view',
    component: EndpointViewComponent,
    canActivate: [OverviewRedirectService]
  },
  {
    path: 'scenario-view',
    component: ScenarioViewComponent,
    canActivate: [OverviewRedirectService]
  },
  {
    path: 'scenario-editor/:scenarioId',
    component: ScenarioEditorComponent,
    canActivate: [OverviewRedirectService]
  },
  { path: '**', component: HomeViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
