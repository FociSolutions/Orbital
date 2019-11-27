import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrbitalCommonModule } from './components/orbital-common/orbital-common.module';
import { GetEndpointScenariosPipe } from './pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from './pipes/get-verb-color/get-verb-color.pipe';
import { DesignerStore } from './store/designer-store';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CreateNewMockViewComponent } from './components/create-new-mock-view/create-new-mock-view.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ImportFromFileViewComponent } from './components/import-from-file-view/import-from-file-view.component';
import { ImportFromServerViewComponent } from './components/import-from-server-view/import-from-server-view.component';
import { EndpointViewComponent } from './components/endpoint-view/endpoint-view.component';
import { EndpointListComponent } from './components/endpoint-view/endpoint-list/endpoint-list.component';
import { OverviewComponent } from './components/overview/overview.component';
import { EndpointListItemComponent } from './components/endpoint-view/endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { ScenarioViewComponent } from './components/scenario-view/scenario-view.component';
import { ScenarioListComponent } from './components/scenario-view/scenario-list/scenario-list.component';
import { ScenarioListItemComponent } from './components/scenario-view/scenario-list-item/scenario-list-item.component';
import { ScenarioEditorComponent } from './components/scenario-editor/scenario-editor.component';
import { MatExpansionModule, MatChipsModule } from '@angular/material';
import { AddBodyRuleComponent } from './components/scenario-editor/add-body-rule-container/add-body-rule/add-body-rule.component';
import { AddBodyRuleContainerComponent } from './components/scenario-editor/add-body-rule-container/add-body-rule-container.component';
// tslint:disable-next-line: max-line-length
import { BodyRuleListItemComponent } from './components/scenario-editor/add-body-rule-container/body-rule-list-item/body-rule-list-item.component';
import { AddMetadataComponent } from './components/scenario-editor/add-metadata/add-metadata.component';
import { AddRequestMatchRuleComponent } from './components/scenario-editor/add-request-match-rule/add-request-match-rule.component';
import { AddResponseComponent } from './components/scenario-editor/add-response/add-response.component';

@NgModule({
  declarations: [
    AppComponent,
    GetEndpointScenariosPipe,
    GetVerbColorPipe,
    HomeViewComponent,
    CreateNewMockViewComponent,
    ImportFromFileViewComponent,
    ImportFromServerViewComponent,
    EndpointViewComponent,
    EndpointListComponent,
    OverviewComponent,
    SideBarComponent,
    ScenarioViewComponent,
    ScenarioListComponent,
    ScenarioListItemComponent,
    SideBarComponent,
    EndpointListItemComponent,
    ScenarioViewComponent,
    ScenarioEditorComponent,
    AddBodyRuleComponent,
    AddBodyRuleContainerComponent,
    BodyRuleListItemComponent,
    AddRequestMatchRuleComponent,
    AddMetadataComponent,
    AddResponseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    CommonModule,
    BrowserAnimationsModule,
    OrbitalCommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatExpansionModule,
    MatChipsModule
  ],
  providers: [DesignerStore],
  bootstrap: [AppComponent]
})
export class AppModule {}
