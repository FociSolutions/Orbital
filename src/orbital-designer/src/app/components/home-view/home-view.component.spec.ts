import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { faker } from '@faker-js/faker';
import { HomeViewComponent } from './home-view.component';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BlankComponent } from 'src/app/shared/components/test/blank.component';
import { DesignerStore } from 'src/app/store/designer-store';
import testMockdefinitionObject from 'src/test-files/test-mockdefinition-object';
import { HttpClientModule } from '@angular/common/http';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

describe('HomeViewComponent', () => {
  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;
  let router: Router;
  let path: string;

  beforeEach(async () => {
    path = faker.random.word();
    await TestBed.configureTestingModule({
      declarations: [HomeViewComponent, BlankComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path,
            component: BlankComponent,
          },
          {
            path: 'endpoint-view',
            component: BlankComponent,
          },
        ]),
        MatGridListModule,
        MatCardModule,
        MatButtonModule,
        HttpClientModule,
        LoggerTestingModule,
      ],
      providers: [DesignerStore],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HomeViewComponent.navigateTo', () => {
    it('should call the navigateUrl function passing in the given url', fakeAsync(() => {
      fixture.ngZone?.run(() => {
        const navigationSpy = jest.spyOn(router, 'navigateByUrl');
        component.navigateTo(path);
        tick();
        fixture.detectChanges();
        expect(navigationSpy).toHaveBeenCalledWith(path);
      });
    }));

    it('should navigate to endpoint-view if store has at least one mock definiition', fakeAsync(() => {
      fixture.ngZone?.run(() => {
        const navigationSpy = jest.spyOn(router, 'navigateByUrl');
        const mockDefs: Record<string, MockDefinition> = {
          key: testMockdefinitionObject,
        };
        component.checkMockDefinitions(mockDefs);
        tick();
        fixture.detectChanges();
        expect(navigationSpy).toHaveBeenCalledWith('/endpoint-view');
      });
    }));
  });
});
