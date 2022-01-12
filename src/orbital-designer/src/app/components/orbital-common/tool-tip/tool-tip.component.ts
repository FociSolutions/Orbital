import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss'],
})
export class ToolTipComponent {
  readonly default_delay = 2000;
  @Input() message!: string;
  @Input() matTooltipClass: unknown = '';
  @Input() icon = 'help_outline';
  @Input() delay = this.default_delay;
}
