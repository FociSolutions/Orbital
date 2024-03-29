import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileInputComponent } from './components/file-input/file-input.component';
import { MatCardModule } from '@angular/material/card';
import { ToolTipComponent } from './components/tooltip/tooltip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShuttleSubListComponent } from './components/shuttle-list/shuttle-sub-list/shuttle-sub-list.component';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ShuttleListComponent } from './components/shuttle-list/shuttle-list.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuickExportComponent } from './components/quick-export/quick-export.component';
import { HttpClientModule } from '@angular/common/http';
import { KeyValuePairFormComponent } from './components/key-value-pair-form/key-value-pair-form.component';
import { KeyValuePairItemFormComponent } from './components/key-value-pair-form/key-value-pair-item-form/key-value-pair-item-form.component';
import { GetStringErrorsPipe } from './pipes/get-string-errors/get-string-errors.pipe';
import { KeyValueRuleItemFormComponent } from './components/key-value-rule-form/key-value-rule-item-form/key-value-rule-item-form.component';
import { KeyValueRuleFormComponent } from './components/key-value-rule-form/key-value-rule-form.component';
import { UrlRuleItemFormComponent } from './components/url-rule-form/url-rule-item-form/url-rule-item-form.component';
import { UrlRuleFormComponent } from './components/url-rule-form/url-rule-form.component';

@NgModule({
  declarations: [
    TextInputComponent,
    FileInputComponent,
    ToolTipComponent,
    ShuttleSubListComponent,
    SearchBarComponent,
    ShuttleListComponent,
    DialogBoxComponent,
    QuickExportComponent,
    KeyValuePairFormComponent,
    KeyValuePairItemFormComponent,
    KeyValueRuleItemFormComponent,
    KeyValueRuleFormComponent,
    UrlRuleItemFormComponent,
    UrlRuleFormComponent,
    GetStringErrorsPipe,
  ],
  exports: [
    TextInputComponent,
    FileInputComponent,
    ToolTipComponent,
    ShuttleSubListComponent,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    SearchBarComponent,
    ShuttleListComponent,
    DialogBoxComponent,
    MatExpansionModule,
    QuickExportComponent,
    KeyValuePairFormComponent,
    KeyValuePairItemFormComponent,
    KeyValueRuleItemFormComponent,
    KeyValueRuleFormComponent,
    UrlRuleItemFormComponent,
    UrlRuleFormComponent,
    GetStringErrorsPipe,
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    HttpClientModule,
  ],
})
export class SharedModule {}
