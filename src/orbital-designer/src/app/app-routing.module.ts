import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateNewMockComponent } from './components/create-new-mock/create-new-mock.component';
import { HomeComponent } from './components/home/home.component';
import { EndpointOverviewComponent } from './components/endpoint-overview/endpoint-overview.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'CreateNewMock', component: CreateNewMockComponent },
  { path: 'EndpointOverview', component: EndpointOverviewComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
