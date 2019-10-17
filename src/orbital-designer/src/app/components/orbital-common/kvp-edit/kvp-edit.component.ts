import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-kvp-edit',
  templateUrl: './kvp-edit.component.html',
  styleUrls: ['./kvp-edit.component.scss']
})
export class KvpEditComponent implements OnInit {
  @Input() existingKvpMap: Map<string, string> = new Map<string, string>();
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;

  @Output() kvpMap: Map<string, string> = new Map<string, string>();

  constructor() {}

  ngOnInit() {}
}
