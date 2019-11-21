import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioViewComponent } from './scenario-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { ScenarioListComponent } from './scenario-list/scenario-list.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ScenarioListItemComponent } from './scenario-list-item/scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { OverviewComponent } from '../overview/overview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import * as faker from 'faker';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';

describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioViewComponent,
        ScenarioListComponent,
        ScenarioListItemComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        GetVerbColorPipe,
        OverviewComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule,
        MatMenuModule,
        MatButtonModule,
        FormsModule,
        MatChipsModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back to the endpoints when the endpoints button is clicked', () => {
    spyOn(component, 'goToEndpoints');

    const button = fixture.debugElement.nativeElement.querySelector(
      'button#back-to-endpoints'
    );
    button.click();

    fixture.whenStable().then(() => {
      expect(component.goToEndpoints).toHaveBeenCalled();
    });
  });

  it('should not show any scenarios if there are no scenarios to show', () => {
    expect(
      fixture.debugElement.query(By.css('app-scenario-list mat-list'))
        .nativeNode.childNodes[0].childNodes.length
    ).toBe(0);
  });

  describe('ScenarioViewComponent.addScenario', () => {
    it('should call addScenario function if the add scenario button is clicked', () => {
      spyOn(component, 'addScenario');
      const button = fixture.debugElement.nativeElement.querySelector(
        'button#add'
      );
      button.click();
      expect(component.addScenario).toHaveBeenCalled();
    });
    it('should navigate to scenario editor', () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      component.addScenario();
      expect(routerSpy.calls.mostRecent().args[0]).toMatch(
        /\/scenario-editor\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });
  describe('ScenarioViewComponent.SearchBar', () => {
    describe('ScenarioViewComponent.scenarioToString', () => {
      it('should return the scenario title', () => {
        const newScenario: Scenario = {
          metadata: {
            title: faker.random.words()
          } as Metadata
        } as Scenario;

        component.scenarioList = [newScenario];

        const scenario = component.scenarioList[0];
        const expected = component.scenarioList[0].metadata.title;
        expect(expected).toEqual(component.scenarioToString(scenario));
      });
      it('should return undefined result', () => {
        const scenario = null;
        expect(component.scenarioToString(scenario)).toBeUndefined();
      });
    });
    describe('ScenarioViewComponent.setFilteredList', () => {
      it('should set the filteredList property to equal the given array', () => {
        const expected = component.scenarioList;
        component.setFilteredList(expected);
        expect(component.filteredList).toEqual(expected);
      });
      it('should set the filtered list to an empty list when the filtered list is null', () => {
        const expected = null;
        component.setFilteredList(expected);
        expect(component.filteredList).toEqual([]);
      });
    });
  });
});
