import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

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

  @Input() panelExpanded: boolean;

  ngOnInit() {
  }

  /**
   * Emits an event when the panel is opened
   */
  handlePanelOpen() {
    this.panelOpened.emit();
  }

  /**
   * Emits an event when the panel is closed
   */
  handlePanelClose() {
    this.panelClosed.emit();
  }
}
