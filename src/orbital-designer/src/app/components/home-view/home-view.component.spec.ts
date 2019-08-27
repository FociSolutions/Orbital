import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as faker from 'faker';
import { HomeViewComponent } from './home-view.component';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

describe('HomeViewComponent', () => {
  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeViewComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        MatGridListModule,
        MatCardModule,
        MatButtonModule
      ]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HomeViewComponent.navigateTo', () => {
    it('should call the navigateUrl function passing in the given url', () => {
      const navigationSpy = spyOn(router, 'navigateByUrl');
      const path = faker.random.word();
      component.navigateTo(path);
      expect(navigationSpy).toHaveBeenCalledWith(path);
    });
  });
});
