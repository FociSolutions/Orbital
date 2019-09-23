import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-shuttle-list',
  templateUrl: './shuttle-list.component.html',
  styleUrls: ['./shuttle-list.component.scss']
})
export class ShuttleListComponent implements OnInit {
  @Input() leftTitle = '';
  @Input() rightTitle = '';

  @Output() outputList: EventEmitter<any[]>;

  @Input() set list(list: any[]) {
    if (!!list) {
      this.leftList = list;
      this.rightList = [];
    }
  }
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';

  leftList: any[] = [];
  rightList: any[] = [];

  leftSelected: any[] = [];
  rightSelected: any[] = [];

  @Input() itemToStringFn: (_: any) => string = x => x as string;

  constructor() {
    this.outputList = new EventEmitter<any[]>();
  }

  onSelect(items: any[], isLeftList: boolean = true): void {
    isLeftList
      ? (this.leftSelected = [...items])
      : (this.rightSelected = [...items]);
  }

  onMove(toRight: boolean = true): void {
    if (toRight) {
      this.rightList = [...this.rightList, ...this.leftSelected];
      this.leftList = this.leftList.filter(
        item => !this.leftSelected.includes(item)
      );
      this.leftSelected = [];
    } else {
      this.leftList = [...this.leftList, ...this.rightSelected];
      this.rightList = this.rightList.filter(
        item => !this.rightSelected.includes(item)
      );
      this.rightSelected = [];
    }
    this.outputList.emit(this.rightList);
  }

  ngOnInit() {}
}
