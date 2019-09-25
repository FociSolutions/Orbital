import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatListOption, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Output() filteredList: EventEmitter<any[]>;

  @Input() list: any[] = [];
  @Input() itemToStringFn: (_: any) => string = x => x as string;
  constructor() {
    this.filteredList = new EventEmitter<any[]>();
  }

  /**
   * Function that takes a string and a list as input and filters out the matlist
   * based on the input text
   * @param value The string to be searched
   * @param list the list to filter out of
   */

  onSearchInput(value: string) {
    this.filteredList.emit(
      this.list.filter(
        option =>
          !SearchBarComponent.ignoreCaseContainsMatch(
            this.itemToStringFn(option.value),
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
  ngOnInit() {}
}
