import { Component, OnInit, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.scss']
})
export class ScenarioCardComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Output() panelOpened = new EventEmitter();
  @Output() panelClosed = new EventEmitter();
  @Input() cardTemplate: TemplateRef<any>;

  panelExpanded: boolean;

  constructor() { }

  ngOnInit() {
  }

  handlePanelOpen() {
    this.panelOpened.emit();
  }

  handlePanelClose() {
    this.panelClosed.emit();
  }
}
