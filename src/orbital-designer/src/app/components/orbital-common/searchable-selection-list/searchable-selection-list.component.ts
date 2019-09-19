import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  MatSelectionListChange,
  MatSelectionList
} from '@angular/material/list';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-searchable-selection-list',
  templateUrl: './searchable-selection-list.component.html',
  styleUrls: ['./searchable-selection-list.component.scss']
})
export class SearchableSelectionListComponent implements OnInit {
  @ViewChild('searchBar', { static: false }) input: ElementRef;
  @ViewChild('matList', { static: false }) matList: MatSelectionList;

  @Output() itemSelected: EventEmitter<any[]>;

  @Input() title?: string = null;
  @Input() list: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';
  @Input() itemToStringFn: (_: any) => string = x => x as string;

  constructor() {
    this.itemSelected = new EventEmitter<any[]>();
  }

  get checkboxLabel() {
    return this.selectAllChecked ? 'Deselect All' : 'Select All';
  }

  get selectAllChecked() {
    return !!this.matList && this.matList.selectedOptions.selected.length > 0;
  }

  onSelectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.matList.selectAll();
    } else {
      this.matList.deselectAll();
    }
  }

  /**
   * Outputs the selected items through the itemSelected emitter
   * @param event The MatSelectionListChange emitted from the material selection list component
   */
  optionSelected(event: MatSelectionListChange) {
    const selected = event.source.selectedOptions.selected;
    this.itemSelected.emit(selected.map(option => option.value));
  }

  /**
   * Function that applies the ignore-case starts with string filter to the list of items.
   * It uses the itemToStringFn property to convert the items into searchable strings to search
   * against
   */
  getSearchedList(): any[] {
    if (!!this.input && this.input.nativeElement.value.length > 0) {
      return this.list.filter(item =>
        SearchableSelectionListComponent.ignoreCaseContainsMatch(
          this.itemToStringFn(item),
          this.input.nativeElement.value
        )
      );
    }
    return this.list;
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
