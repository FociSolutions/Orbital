import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnChanges {
  @Output() filteredList: EventEmitter<unknown[]>;
  @ViewChild(MatInput) input: MatInput;
  @Input() list: unknown[] = [];
  @Input() itemToStringFn: (_: unknown) => string = (x: string) => x;
  constructor() {
    this.filteredList = new EventEmitter<unknown[]>();
  }

  /**
   * Function that takes a string and a list as input and filters out the mat list
   * based on the input text
   * @param value The string to be searched
   */

  onSearchInput(value: string) {
    this.filteredList.emit(
      this.list.filter((option) => SearchBarComponent.ignoreCaseContainsMatch(this.itemToStringFn(option), value))
    );
  }

  /**
   * Returns true if the target parameter contains the substring parameter. It sets
   * both of them to lowercase before performing the compares in order to ignore case.
   */
  static ignoreCaseContainsMatch(target: string, substring: string): boolean {
    return target.toLowerCase().includes(substring.toLowerCase());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.list) {
      if (this.input) {
        this.input.value = '';
      }
      this.onSearchInput('');
    }
  }
}
