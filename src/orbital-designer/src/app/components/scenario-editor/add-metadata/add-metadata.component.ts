import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.scss']
})
export class AddMetadataComponent implements OnInit {
  @Input() metadata: Metadata;
  @Input() saveStatus: boolean;

  @Output() metadataOutput: EventEmitter<Metadata>;
  @Output() isValid: boolean;
  constructor() { }

  ngOnInit() {
  }

}
