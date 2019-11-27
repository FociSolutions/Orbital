import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { extendBuiltInValidatorFactory } from 'src/app/validators/extend-built-in-validator-factory/extend-built-in-validator-factory';
import { Validators, FormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-shuttle-list',
  templateUrl: './shuttle-list.component.html',
  styleUrls: ['./shuttle-list.component.scss']
})
export class ShuttleListComponent implements OnInit, OnDestroy {
  @Input() leftTitle = '';
  @Input() rightTitle = '';

  @Output() outputList: EventEmitter<any[]>;

  @Input() set list(list: any[]) {
    if (!!list) {
      this.leftList = list.filter(control => control.valid);
    } else {
      this.leftList = [];
    }
    this.rightList = [];
  }
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';

  leftList: any[] = [];
  rightList: any[] = [];

  leftSelected: any[] = [];
  rightSelected: any[] = [];

  @Input() itemToStringFn: (_: any) => string = x => x as string;

  constructor(private logger: NGXLogger) {
    this.outputList = new EventEmitter<any[]>();
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
  onSelectLeft(items: any[]): void {
    this.leftSelected = [...items];
  }

  /**
   * Sets the rightSelected list to the items passed into it
   * @param items The list of items to set as selected from the right list
   */
  onSelectRight(items: any[]): void {
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
