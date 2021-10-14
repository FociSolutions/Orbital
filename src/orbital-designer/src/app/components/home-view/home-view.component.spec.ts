import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as faker from 'faker';
import { HomeViewComponent } from './home-view.component';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BlankComponent } from 'src/app/shared/components/test/blank.component';

describe('HomeViewComponent', () => {
  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;
  let router: Router;
  let path: string;

  beforeEach(() => {
    path = faker.random.word();
    TestBed.configureTestingModule({
      declarations: [HomeViewComponent, BlankComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: path,
            component: BlankComponent,
          },
        ]),
        MatGridListModule,
        MatCardModule,
        MatButtonModule,
      ],
    }).compileComponents();
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(HomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HomeViewComponent.navigateTo', () => {
    it('should call the navigateUrl function passing in the given url', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const navigationSpy = jest.spyOn(router, 'navigateByUrl');
        component.navigateTo(path);
        tick();
        fixture.detectChanges();
        expect(navigationSpy).toHaveBeenCalledWith(path);
      });
    }));
  });
});
