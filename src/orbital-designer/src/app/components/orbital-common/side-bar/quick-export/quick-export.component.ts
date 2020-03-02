import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-export',
  templateUrl: './quick-export.component.html',
  styleUrls: ['./quick-export.component.scss']
})
export class QuickExportComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
}
