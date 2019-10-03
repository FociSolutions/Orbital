import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Metadata } from '../../models/mock-definition/metadata.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() metadata: Metadata;
  @Input() header: TemplateRef<any>;
  constructor() {}

  ngOnInit() {}
}
