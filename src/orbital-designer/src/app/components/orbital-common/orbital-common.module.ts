import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TextInputComponent } from './text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileInputComponent } from './file-input/file-input.component';
import { RestRequestInputComponent } from './rest-request-input/rest-request-input.component';
import { MatCardModule } from '@angular/material/card';
import { ToolTipComponent } from './tool-tip/tool-tip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    TextInputComponent,
    FileInputComponent,
    RestRequestInputComponent,
    ToolTipComponent
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
    MatListModule
  ],
  exports: [
    TextInputComponent,
    FileInputComponent,
    ToolTipComponent,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    RestRequestInputComponent
  ]
})
export class OrbitalCommonModule {}
