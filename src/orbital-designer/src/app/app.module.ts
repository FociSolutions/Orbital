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
import { CreateEditMockViewComponent } from './components/create-edit-mock-view/create-edit-mock-view.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ImportFromFileViewComponent } from './components/import-from-file-view/import-from-file-view.component';
import { ImportFromServerViewComponent } from './components/import-from-server-view/import-from-server-view.component';
import { EndpointViewComponent } from './components/endpoint-view/endpoint-view.component';
import { EndpointListComponent } from './components/endpoint-view/endpoint-list/endpoint-list.component';
import { OverviewHeaderComponent } from './components/orbital-common/overview-header/overview-header.component';
import { EndpointListItemComponent } from './components/endpoint-view/endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent } from './components/orbital-common/side-bar/side-bar.component';
import { ScenarioViewComponent } from './components/scenario-view/scenario-view.component';
import { ScenarioEditorComponent } from './components/scenario-editor/scenario-editor.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddMetadataComponent } from './components/scenario-editor/add-metadata/add-metadata.component';
import { AddRequestMatchRuleComponent } from './components/scenario-editor/add-request-match-rule/add-request-match-rule.component';
import { AddResponseComponent } from './components/scenario-editor/add-response/add-response.component';
import { DownloadMockdefinitionsComponent } from './components/download-mockdefinitions/download-mockdefinitions.component';
import { ExportToServerViewComponent } from './components/export-to-server-view/export-to-server-view.component';
import { GetVerbStringPipe } from './pipes/get-verb-string/get-verb-string.pipe';
// eslint-disable-next-line max-len
import { KvpListItemRuleTypeComponent } from './components/scenario-editor/kvp-edit-rule/kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { KvpEditRuleComponent } from './components/scenario-editor/kvp-edit-rule/kvp-edit-rule.component';
import { GetRuleTypeStringPipe } from './pipes/get-rule-type-string/get-rule-type-string.pipe';
import { UrlEditRuleComponent } from './components/scenario-editor/url-edit-rule/url-edit-rule.component';
import { UrlAddRuleComponent } from './components/scenario-editor/url-edit-rule/url-add-rule/url-add-rule.component';
// eslint-disable-next-line max-len
import { UrlListItemRuleTypeComponent } from './components/scenario-editor/url-edit-rule/url-list-item-rule-type/url-list-item-rule-type.component';
import { PolicyAddComponent } from './components/scenario-editor/policy-container/policy-add/policy-add.component';
import { PolicyEditComponent } from './components/scenario-editor/policy-container/policy-edit/policy-edit.component';
import { PolicyComponent } from './components/scenario-editor/policy-container/policy/policy.component';
import { BodyAddRuleComponent } from './components/scenario-editor/add-body-rule-edit/body-add-rule/body-add-rule.component';
// eslint-disable-next-line max-len
import { BodyListItemRuleTypeComponent } from './components/scenario-editor/add-body-rule-edit/body-list-item-rule-type/body-list-item-rule-type.component';
import { BodyEditRuleComponent } from './components/scenario-editor/add-body-rule-edit/body-edit-rule.component';
import { DeleteFromServerViewComponent } from './components/delete-from-server-view/delete-from-server-view.component';
import { CoreModule } from './core/core.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';

@NgModule({
  declarations: [
    AppComponent,
    GetEndpointScenariosPipe,
    GetVerbColorPipe,
    HomeViewComponent,
    CreateEditMockViewComponent,
    ImportFromFileViewComponent,
    ImportFromServerViewComponent,
    EndpointViewComponent,
    EndpointListComponent,
    OverviewHeaderComponent,
    SideBarComponent,
    ScenarioViewComponent,
    SideBarComponent,
    EndpointListItemComponent,
    ScenarioViewComponent,
    ScenarioEditorComponent,
    AddRequestMatchRuleComponent,
    AddMetadataComponent,
    GetVerbStringPipe,
    DownloadMockdefinitionsComponent,
    ExportToServerViewComponent,
    AddResponseComponent,
    KvpListItemRuleTypeComponent,
    KvpEditRuleComponent,
    GetRuleTypeStringPipe,
    UrlEditRuleComponent,
    UrlAddRuleComponent,
    UrlListItemRuleTypeComponent,
    PolicyAddComponent,
    PolicyEditComponent,
    PolicyComponent,
    BodyAddRuleComponent,
    BodyListItemRuleTypeComponent,
    BodyEditRuleComponent,
    DeleteFromServerViewComponent,
  ],
  imports: [
    CoreModule,
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
    MatChipsModule,
    MatSnackBarModule,
    NgJsonEditorModule,
  ],
  providers: [DesignerStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
