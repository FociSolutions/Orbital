import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss']
})
export class ToolTipComponent {
  @Input() message!: string;
  @Input() matTooltipClass: any = '';
  @Input() icon = 'help_outline';
  @Input() delay = 2000;

}
