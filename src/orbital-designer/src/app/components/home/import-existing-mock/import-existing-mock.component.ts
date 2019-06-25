import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-existing-mock',
  templateUrl: './import-existing-mock.component.html',
  styleUrls: ['./import-existing-mock.component.scss']
})
export class ImportExistingMockComponent implements OnInit {
  fileName = 'Import Existing Mock Definition';

  constructor() {}

  ngOnInit() {}

  /**
   * Handles on change event for the file input
   * @param files Mock definition file selected
   */
  onFileInput(files: FileList) {}
}
