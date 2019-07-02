import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbButtonModule,
  NbCardModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './components/home/home.component';
import { ImportExistingMockComponent } from './components/home/import-existing-mock/import-existing-mock.component';
import { CreateNewMockComponent } from './components/create-new-mock/create-new-mock.component';
import { NewMockFormComponent } from './components/create-new-mock/new-mock-form/new-mock-form.component';
import { NewMockTitleComponent } from './components/create-new-mock/new-mock-title/new-mock-title.component';
import { EditScenarioComponent } from './components/edit-scenario/edit-scenario.component';
import { EndpointOverviewComponent } from './components/endpoint-overview/endpoint-overview.component';
import { EndpointListComponent } from './components/endpoint-overview/endpoint-list/endpoint-list.component';
import { EndpointListItemComponent } from './components/endpoint-overview/endpoint-list-item/endpoint-list-item.component';
import { ScenarioOverviewComponent } from './components/scenario-overview/scenario-overview.component';
import { MockDefinitionStore } from './store/mockdefinitionstore';
import { EndpointsStore } from './store/endpoints-store';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImportExistingMockComponent,
    CreateNewMockComponent,
    NewMockFormComponent,
    NewMockTitleComponent,
    EditScenarioComponent,
    EndpointOverviewComponent,
    EndpointListComponent,
    EndpointListItemComponent,
    ScenarioOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbButtonModule,
    NbCardModule
  ],
  providers: [MockDefinitionStore, EndpointsStore],
  bootstrap: [AppComponent]
})
export class AppModule {}
