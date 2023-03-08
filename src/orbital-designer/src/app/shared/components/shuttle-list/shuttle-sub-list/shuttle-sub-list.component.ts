import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import {
  MatLegacyListOption as MatListOption,
  MatLegacySelectionList as MatSelectionList,
} from '@angular/material/legacy-list';

@Component({
  selector: 'app-shuttle-sub-list',
  templateUrl: './shuttle-sub-list.component.html',
  styleUrls: ['./shuttle-sub-list.component.scss'],
})
export class ShuttleSubListComponent<T> {
  static readonly selectAllString = 'Select All';
  static readonly deselectAllString = 'Deselect All';

  filteredOutOptions: MatListOption[] = [];

  @ViewChild('matList') matList: MatSelectionList | null = null;

  @Output() itemSelected = new EventEmitter<T[]>();

  @Input() list: T[] = [];
  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';
  @Input() itemToStringFn: (_: T) => string = (item: T) => String(item);

  /**
   * Returns the label for the check box based upon whether or not
   * the checkbox should be selected or not. If the check box should be selected then
   * it returns the deselectAllString, else it returns the selectAllString
   */
  get checkboxLabel() {
    return this.selectAllChecked ? ShuttleSubListComponent.deselectAllString : ShuttleSubListComponent.selectAllString;
  }

  /**
   * Returns true if the selection check box should be marked as checked, false otherwise
   * This is determined by checking to see if any of the options are selected. If any
   * of the options are selected then the checkbox should be selected because it's
   * functionality is now to deselect the selected options.
   */
  get selectAllChecked(): boolean {
    return !!this.matList?.selectedOptions.selected.filter((opt) => !this.hideOption(opt.value)).length;
  }

  /**
   * A function that selects or deselects all options depending on wether the checkbox is
   * being selected or deselected.
   * @param event The checkbox change event emitted by the select/deselect all checkbox
   */
  onSelectAll(event: MatCheckboxChange) {
    this.matList?.options.forEach(
      (option) => (option.selected = this.hideOption(option.value) ? option.selected : event.checked)
    );
    this.itemSelected.emit(this.matList?.selectedOptions.selected.map((option) => option.value));

    this.emitSearchResultsSelected();
  }

  /**
   * Outputs the selected items through the itemSelected emitter
   */
  optionSelected() {
    this.emitSearchResultsSelected();
  }

  /**
   * Returns true if the item should be hidden from view (filtered),
   * false otherwise
   * @param item The item being checked against
   */
  hideOption(item: T): boolean {
    if (this.filteredOutOptions.length > 0) {
      return !!this.filteredOutOptions.find((option) => option.value === item);
    }
    return false;
  }

  /**
   * function run that updates the filteredOptions property based on the inputs value
   * @param value The string value from the input
   */
  onSearchInput(value: string) {
    this.filteredOutOptions =
      this.matList?.options.filter(
        (option) => !ShuttleSubListComponent.ignoreCaseContainsMatch(this.itemToStringFn(option.value), value)
      ) ?? [];
    this.emitSearchResultsSelected();
  }

  get isEmpty() {
    return this.list.length === 0;
  }

  get noSearchResults() {
    return this.list.length > 0 && this.list.length === this.filteredOutOptions.length;
  }

  /**
   * Returns true if the target parameter contains the substring parameter. It sets
   * both of them to lowercase before performing the compares in order to ignore case.
   */
  static ignoreCaseContainsMatch(target: string, substring: string): boolean {
    return target.toLowerCase().includes(substring.toLowerCase());
  }

  /**
   * Emits the selected items in the search results that are visible to the user
   */
  private emitSearchResultsSelected() {
    this.itemSelected.emit(
      this.matList?.selectedOptions.selected
        .filter((e) => !this.filteredOutOptions.includes(e))
        .filter((option) => option.selected)
        .map((option) => option.value)
    );
  }
}
