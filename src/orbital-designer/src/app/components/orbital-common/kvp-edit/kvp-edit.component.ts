import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-kvp-edit',
  templateUrl: './kvp-edit.component.html',
  styleUrls: ['./kvp-edit.component.scss']
})
export class KvpEditComponent implements OnInit {
  @Input() existingKvpMap: Map<string, string> = new Map<string, string>();
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;

  @Output() kvpMap = new EventEmitter<Map<string, string>>();

  constructor() {}

  ngOnInit() {}
}
