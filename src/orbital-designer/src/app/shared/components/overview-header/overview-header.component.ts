import { Component, Input, TemplateRef } from '@angular/core';
import { Metadata } from '../../../models/mock-definition/metadata.model';

@Component({
  selector: 'app-overview-header',
  templateUrl: './overview-header.component.html',
  styleUrls: ['./overview-header.component.scss'],
})
export class OverviewHeaderComponent {
  @Input() metadata: Metadata | undefined;
  @Input() header: TemplateRef<unknown> | undefined;
}
