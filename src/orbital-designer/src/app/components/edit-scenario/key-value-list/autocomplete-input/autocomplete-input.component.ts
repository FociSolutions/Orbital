import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { empty } from 'rxjs';

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss']
})
export class AutocompleteInputComponent implements OnInit {

  @Output()changeData: EventEmitter<string>;
  @Input() keys?: string[];
  @Input() value: string;

  constructor() {
    this.changeData = new EventEmitter<string>();
   }

  ngOnInit() {
  }

  searchFromArray(value: string): string[] {
    if ( this.keys === undefined) {
      return [];
    }
    if ( this.keys.length > 0)  {
      return this.keys.filter(key => !!key.toLocaleLowerCase().match(value.toLocaleLowerCase())).sort();
    }

  }
}
