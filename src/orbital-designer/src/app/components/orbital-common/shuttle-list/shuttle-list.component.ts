import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

@Component({
  selector: 'app-shuttle-list',
  templateUrl: './shuttle-list.component.html',
  styleUrls: ['./shuttle-list.component.scss']
})
export class ShuttleListComponent implements OnInit, OnDestroy {
  @Input() leftTitle = '';
  @Input() rightTitle = '';

  @Output() outputList: EventEmitter<MockDefinition[]>;

  @Input() set list(list: MockDefinition[]) {
    if (!!list) {
      this.leftList = list;
      this.rightList = [];
    }
  }

  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';

  leftList: MockDefinition[] = [];
  rightList: MockDefinition[] = [];

  leftSelected: MockDefinition[] = [];
  rightSelected: MockDefinition[] = [];

  @Input() itemToStringFn: (_: MockDefinition) => string = x => x as unknown as string;

  constructor() {
    this.outputList = new EventEmitter<MockDefinition[]>();
  }

  /**
   * completes event emitter
   */
  ngOnDestroy() {
    this.outputList.complete();
  }

  /**
   * Sets the leftSelected list to the items passed into it
   * @param items The list of items to set as selected from the left list
   */
  onSelectLeft(items: MockDefinition[]): void {
    this.leftSelected = [...items];
  }

  /**
   * Sets the rightSelected list to the items passed into it
   * @param items The list of items to set as selected from the right list
   */
  onSelectRight(items: MockDefinition[]): void {
    this.rightSelected = [...items];
  }

  /**
   * Responsible for moving the selected list items from the left list to the right list.
   */
  onMoveRight(): void {
    this.rightList = [...this.rightList, ...this.leftSelected];
    this.leftList = this.leftList.filter(
      item => !this.leftSelected.includes(item)
    );
    this.leftSelected = [];
    this.outputList.emit(this.rightList);
  }

  /**
   * Responsible for moving the selected list items form the right list to the left list
   */
  onMoveLeft(): void {
    this.leftList = [...this.leftList, ...this.rightSelected];
    this.rightList = this.rightList.filter(
      item => !this.rightSelected.includes(item)
    );
    this.rightSelected = [];
    this.outputList.emit(this.rightList);
  }

  ngOnInit() {}
}
