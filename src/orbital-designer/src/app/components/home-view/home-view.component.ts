import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent {

  constructor(private router: Router) { }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

}
