import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Predicate,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './searchable-list.component.html',
  styleUrls: ['./searchable-list.component.scss']
})
export class SearchableListComponent implements OnInit {
  constructor() {}

  @ViewChild('searchBar', { static: false }) input: ElementRef;
  @Input() title?: string = null;
  @Input() list: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() emptyListMessage = 'List is empty';
  @Input() noSearchResultsMessage = 'No search results found';
  @Input() itemToStringFn: (_: any) => string = x => x as string;

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

  // tslint:disable-next-line: member-ordering
  static ignoreCaseStartsWithMatch(left: string, right: string): boolean {
    return left.toLowerCase().startsWith(right.toLowerCase());
  }

  ngOnInit() {}
}
