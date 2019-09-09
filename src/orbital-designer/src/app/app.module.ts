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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrbitalCommonModule } from './components/orbital-common/orbital-common.module';
import { GetEndpointScenariosPipe } from './pipes/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from './pipes/get-verb-color.pipe';
import { DesignerStore } from './store/designer-store';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CreateNewMockViewComponent } from './components/create-new-mock-view/create-new-mock-view.component';
import { ImportFromFileComponent } from './components/import-from-file/import-from-file.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    GetEndpointScenariosPipe,
    GetVerbColorPipe,
    HomeViewComponent,
    CreateNewMockViewComponent,
    ImportFromFileComponent
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
    FormsModule
  ],
  providers: [DesignerStore],
  bootstrap: [AppComponent]
})
export class AppModule {}
