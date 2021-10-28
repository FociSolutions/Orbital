import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewRedirectService } from './services/overview-redirect/overview-redirect.service';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CreateEditMockViewComponent } from './components/create-edit-mock-view/create-edit-mock-view.component';
import { ImportFromFileViewComponent } from './components/import-from-file-view/import-from-file-view.component';
import { ImportFromServerViewComponent } from './components/import-from-server-view/import-from-server-view.component';
import { EndpointViewComponent } from './components/endpoint-view/endpoint-view.component';
import { ScenarioViewComponent } from './components/scenario-view/scenario-view.component';
import { ScenarioEditorComponent } from './components/scenario-editor/scenario-editor.component';
import { DownloadMockdefinitionsComponent } from './components/download-mockdefinitions/download-mockdefinitions.component';
import { ExportToServerViewComponent } from './components/export-to-server-view/export-to-server-view.component';
import { DeleteFromServerViewComponent } from './components/delete-from-server-view/delete-from-server-view.component';

const routes: Routes = [
  { path: 'create-new-mock', component: CreateEditMockViewComponent },
  { path: 'edit-mock/:uuid', component: CreateEditMockViewComponent },
  { path: 'import-from-file', component: ImportFromFileViewComponent },
  {
    path: 'download-mockdefinitions',
    component: DownloadMockdefinitionsComponent
  },
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
  {
    path: 'export-to-server',
    component: ExportToServerViewComponent,
    canActivate: [OverviewRedirectService]
  },
  { path: 'delete-from-server', component: DeleteFromServerViewComponent },
  { path: '**', component: HomeViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
