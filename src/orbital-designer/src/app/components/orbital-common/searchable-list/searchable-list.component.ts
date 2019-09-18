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
  @ViewChild('searchBar', { static: false }) input: ElementRef;
  @Input() list: any[] = [];
  @Input() itemTemplate: TemplateRef<any>;
  @Input() searchPredicate: Predicate<any>;

  constructor() {}
  ngOnInit() {}

  getSearchedList(): any[] {
    if (!!this.searchPredicate) {
      return this.list.filter(this.searchPredicate);
    }
    return this.list;
  }
}
