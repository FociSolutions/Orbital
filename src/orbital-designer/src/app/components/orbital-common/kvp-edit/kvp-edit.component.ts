import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-kvp-edit',
  templateUrl: './kvp-edit.component.html',
  styleUrls: ['./kvp-edit.component.scss']
})
export class KvpEditComponent implements OnInit {
  @Input() kvpMap: Map<string, string> = new Map<string, string>();
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;

  @Output() savedKvpMap = new EventEmitter<Map<string, string>>();

  ngOnInit() {}
}
