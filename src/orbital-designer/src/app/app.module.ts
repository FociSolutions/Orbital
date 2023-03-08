import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { GetEndpointScenariosPipe } from './pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from './pipes/get-verb-color/get-verb-color.pipe';
import { DesignerStore } from './store/designer-store';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CreateEditMockViewComponent } from './components/create-edit-mock-view/create-edit-mock-view.component';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { ImportFromFileViewComponent } from './components/import-from-file-view/import-from-file-view.component';
import { ImportFromServerViewComponent } from './components/import-from-server-view/import-from-server-view.component';
import { EndpointViewComponent } from './components/endpoint-view/endpoint-view.component';
import { EndpointListComponent } from './components/endpoint-view/endpoint-list/endpoint-list.component';
import { OverviewHeaderComponent } from './shared/components/overview-header/overview-header.component';
import { EndpointListItemComponent } from './components/endpoint-view/endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { ScenarioViewComponent } from './components/scenario-view/scenario-view.component';
import { ScenarioEditorComponent } from './components/scenario-editor/scenario-editor.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MetadataFormComponent } from './components/scenario-editor/metadata-form/metadata-form.component';
import { ResponseFormComponent } from './components/scenario-editor/response-form/response-form.component';
import { DownloadMockdefinitionsComponent } from './components/download-mockdefinitions/download-mockdefinitions.component';
import { ExportToServerViewComponent } from './components/export-to-server-view/export-to-server-view.component';
import { GetVerbStringPipe } from './pipes/get-verb-string/get-verb-string.pipe';
import { GetRuleTypeStringPipe } from './pipes/get-rule-type-string/get-rule-type-string.pipe';
import { PoliciesFormComponent } from './components/scenario-editor/policies-form/policies-form.component';
import { DeleteFromServerViewComponent } from './components/delete-from-server-view/delete-from-server-view.component';
import { CoreModule } from './core/core.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { PolicyFormComponent } from './components/scenario-editor/policies-form/policy-form/policy-form.component';
import { BodyRuleFormComponent } from './components/scenario-editor/body-rule-form/body-rule-form.component';
import { BodyRuleItemFormComponent } from './components/scenario-editor/body-rule-form/body-rule-item-form/body-rule-item-form.component';
import { RequestFormComponent } from './components/scenario-editor/request-form/request-form.component';

@NgModule({
  declarations: [
    MetadataFormComponent,
    RequestFormComponent,
    ResponseFormComponent,
    AppComponent,
    CreateEditMockViewComponent,
    DeleteFromServerViewComponent,
    DownloadMockdefinitionsComponent,
    EndpointListComponent,
    EndpointListItemComponent,
    EndpointViewComponent,
    ExportToServerViewComponent,
    GetEndpointScenariosPipe,
    GetRuleTypeStringPipe,
    GetVerbColorPipe,
    GetVerbStringPipe,
    HomeViewComponent,
    ImportFromFileViewComponent,
    ImportFromServerViewComponent,
    OverviewHeaderComponent,
    PoliciesFormComponent,
    PolicyFormComponent,
    ScenarioEditorComponent,
    ScenarioViewComponent,
    SideBarComponent,
    BodyRuleItemFormComponent,
    BodyRuleFormComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    CoreModule,
    HttpClientModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    MaterialModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    NgJsonEditorModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [DesignerStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
