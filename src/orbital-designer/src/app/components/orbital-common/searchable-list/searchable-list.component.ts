import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './searchable-list.component.html',
  styleUrls: ['./searchable-list.component.scss']
})
export class SearchableListComponent implements OnInit {
  @ViewChild('searchBar', { static: false }) input: ElementRef;
  @Input() title?: string = null;
  @Input() list: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';
  @Input() itemToStringFn: (_: any) => string = x => x as string;
  constructor() {}

  /**
   * Function that applies the ignore-case starts with string filter to the list of items.
   * It uses the itemToStringFn property to convert the items into searchable strings to search
   * against
   */
  getSearchedList(): any[] {
    if (!!this.input && this.input.nativeElement.value.length > 0) {
      return this.list.filter(item =>
        SearchableListComponent.ignoreCaseStartsWithMatch(
          this.itemToStringFn(item),
          this.input.nativeElement.value
        )
      );
    }
    return this.list;
  }

  /**
   * Returns true if the target string starts with the startsWith string. It sets
   * both of them to lowercase before perfoming the compares in order to ignore case.
   */
  // tslint:disable-next-line: member-ordering
  static ignoreCaseStartsWithMatch(
    target: string,
    startsWith: string
  ): boolean {
    return target.toLowerCase().startsWith(startsWith.toLowerCase());
  }
  ngOnInit() {}
}
