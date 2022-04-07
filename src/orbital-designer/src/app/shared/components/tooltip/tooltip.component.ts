import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class ToolTipComponent {
  readonly default_delay = 2000;
  @Input() message!: string;
  @Input() matTooltipClass = '';
  @Input() icon = 'help_outline';
  @Input() delay = this.default_delay;
}
