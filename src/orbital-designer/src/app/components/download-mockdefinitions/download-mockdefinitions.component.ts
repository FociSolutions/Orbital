/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormControl } from '@angular/forms';
import { DesignerStore } from 'src/app/store/designer-store';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-download-mockdefinitions',
  templateUrl: './download-mockdefinitions.component.html',
  styleUrls: ['./download-mockdefinitions.component.scss'],
})
export class DownloadMockdefinitionsComponent implements OnInit, OnDestroy {
  outputList: EventEmitter<unknown[]>;

  emptyListMessage = 'List is empty';
  noSearchResultsMessage = 'No search results found';

  list: FormControl[] = [];
  selected: any[] = [];
  isMockSelected = false;

  controlsMockDefinitionToString = (control: AbstractControl) => control.value?.metadata?.title ?? '';

  constructor(private location: Location, private store: DesignerStore) {
    this.outputList = new EventEmitter<unknown[]>();
  }

  ngOnInit() {
    this.store.state$.subscribe((state) => {
      this.list = Object.values(state.mockDefinitions).map((md) => new FormControl(cloneDeep(md)));
    });
  }

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
    this.isMockSelected = this.selected.length !== 0;
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
    this.selected.forEach((mockDefinition) => {
      const blob = new Blob([JSON.stringify(mockDefinition.value)], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${mockDefinition.value.metadata.title}.json`);
    });
  }
}
