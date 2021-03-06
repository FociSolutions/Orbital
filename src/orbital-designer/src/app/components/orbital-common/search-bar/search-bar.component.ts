import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  OnChanges
} from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnChanges {
  @Output() filteredList: EventEmitter<any[]>;
  @ViewChild(MatInput, { static: false }) input: MatInput;
  @Input() list: any[] = [];
  @Input() itemToStringFn: (_: any) => string = x => x as string;
  constructor() {
    this.filteredList = new EventEmitter<any[]>();
  }

  /**
   * Function that takes a string and a list as input and filters out the matlist
   * based on the input text
   * @param value The string to be searched
   */

  onSearchInput(value: string) {
    this.filteredList.emit(
      this.list.filter(option =>
        SearchBarComponent.ignoreCaseContainsMatch(
          this.itemToStringFn(option),
          value
        )
      )
    );
  }

  /**
   * Returns true if the target parameter contains the substring parameter. It sets
   * both of them to lowercase before performing the compares in order to ignore case.
   */
  // tslint:disable-next-line: member-ordering
  static ignoreCaseContainsMatch(target: string, substring: string): boolean {
    return target.toLowerCase().includes(substring.toLowerCase());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.list) {
      if (!!this.input) {
        this.input.value = '';
      }
      this.onSearchInput('');
    }
  }
  ngOnInit() {}
}
