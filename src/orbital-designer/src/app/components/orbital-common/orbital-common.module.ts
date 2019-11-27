import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TextInputComponent } from './text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileInputComponent } from './file-input/file-input.component';
import { MatCardModule } from '@angular/material/card';
import { ToolTipComponent } from './tool-tip/tool-tip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchableSelectionListComponent } from './searchable-selection-list/searchable-selection-list.component';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ShuttleListComponent } from './shuttle-list/shuttle-list.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { KvpEditComponent } from './kvp-edit/kvp-edit.component';
import { KvpAddComponent } from './kvp-edit/kvp-add/kvp-add.component';
import { KvpListItemComponent } from './kvp-edit/kvp-list-item/kvp-list-item.component';
import { MatExpansionModule } from '@angular/material';

@NgModule({
  declarations: [
    TextInputComponent,
    FileInputComponent,
    ToolTipComponent,
    SearchableSelectionListComponent,
    SearchBarComponent,
    ShuttleListComponent,
    DialogBoxComponent,
    KvpEditComponent,
    KvpAddComponent,
    KvpListItemComponent
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
    MatExpansionModule
  ],
  exports: [
    TextInputComponent,
    FileInputComponent,
    ToolTipComponent,
    SearchableSelectionListComponent,
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
    KvpEditComponent,
    KvpAddComponent,
    KvpListItemComponent,
    MatExpansionModule
  ]
})
export class OrbitalCommonModule {}
