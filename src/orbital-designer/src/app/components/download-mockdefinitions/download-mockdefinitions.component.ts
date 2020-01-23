import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormControl } from '@angular/forms';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { saveAs } from 'file-saver';
import { recordMap } from 'src/app/models/record';

@Component({
  selector: 'app-download-mockdefinitions',
  templateUrl: './download-mockdefinitions.component.html',
  styleUrls: ['./download-mockdefinitions.component.scss']
})
export class DownloadMockdefinitionsComponent implements OnInit, OnDestroy {
  outputList: EventEmitter<any[]>;

  emptyListMessage = 'List is empty';
  noSearchResultsMessage = 'No search results found';

  list: any[] = [];
  selected: any[] = [];
  isMockSelected = false;

  constructor(private location: Location, private store: DesignerStore) {
    this.outputList = new EventEmitter<any[]>();
  }

  ngOnInit() {
    this.list = recordMap(this.store.state.mockDefinitions, md => new FormControl(md));
  }

  itemToStringFn = (control: AbstractControl) =>
    (control.value as MockDefinition).metadata.title

  /**
   * Completes event emitter
   */
  ngOnDestroy() {
    this.outputList.complete();
  }

  /**
   * Sets the selected list to the items passed into it
   * @param items The list of items to set as selected from the left list
   */
  onSelect(items: any[]): void {
    this.selected = [...items];
    this.isMockSelected = (this.selected.length !== 0);
  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  /**
   * Downloads multiple mock files from the designer
   */
  downloadMocks() {
    this.selected.forEach(mockDefinition => {
      const blob = new Blob(
        [JSON.stringify(mockDefinition.value)],
        { type: 'text/plain;charset=utf-8' }
      );
      saveAs(blob, mockDefinition.value.metadata.title + '.json');
    });
  }
}
