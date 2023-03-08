import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatLegacyInput as MatInput } from '@angular/material/legacy-input';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent<T> implements OnChanges {
  @Output() filteredList = new EventEmitter<T[]>();
  @ViewChild(MatInput) input: MatInput | undefined;
  @Input() list: T[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() itemToStringFn: (_: any) => string = (x: any) => String(x);

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
