import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  control: FormControl;
  constructor(private location: Location) {
    this.control = new FormControl([]);
  }

  ngOnInit() {}

  importMock() {}

  onResponse(response: HttpResponse<unknown>) {
    console.log(response);
  }

  onBack() {
    this.location.back();
  }
}
