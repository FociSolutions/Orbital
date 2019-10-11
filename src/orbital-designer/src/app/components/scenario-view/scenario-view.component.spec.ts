import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioViewComponent } from './scenario-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { ScenarioListComponent } from './scenario-list/scenario-list.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ScenarioListItemComponent } from './scenario-list-item/scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { OverviewComponent } from '../overview/overview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { VerbType } from 'src/app/models/verb.type';
import { By } from '@angular/platform-browser';
import testMockdefinitionObject from 'src/test-files/test-mockdefinition-object';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { componentFactoryName } from '@angular/compiler';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

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
        OverviewComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule,
        MatMenuModule,
        MatButtonModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    component.mockDefinition = JSON.parse(
      JSON.stringify(testMockdefinitionObject)
    );

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

  describe('ScenarioViewComponent.getScenarioDescription', () => {
    it('should show the default scenario description if there is no scenario description', () => {
      expect(component.getScenarioDescription()).toBe('No description');
    });

    it('should show the scenario description if there is one set if the scenario is valid', () => {
      const componentMockDef = JSON.parse(
        JSON.stringify(component.mockDefinition)
      );
      const endpointBefore = JSON.parse(
        JSON.stringify(component.selectedEndpoint)
      );

      component.selectedEndpoint = componentMockDef;
      component.selectedEndpoint.verb = VerbType.POST;
      component.selectedEndpoint.path = '/pets';

      expect(component.getScenarioDescription()).toBe('Create a pet');
      component.selectedEndpoint = endpointBefore;
    });

    it('should not show the scenario description if the selected endpoint is null', () => {
      const endpointBefore = JSON.parse(
        JSON.stringify(component.selectedEndpoint)
      );

      component.selectedEndpoint = null;

      expect(component.getScenarioDescription()).toBe('No description');
      component.selectedEndpoint = endpointBefore;
    });

    it('should not show the scenario description if the path is not set', () => {
      const componentMockDef = JSON.parse(
        JSON.stringify(component.mockDefinition)
      );
      const endpointBefore = JSON.parse(
        JSON.stringify(component.selectedEndpoint)
      );

      component.selectedEndpoint = componentMockDef;
      component.selectedEndpoint.verb = VerbType.POST;

      expect(component.getScenarioDescription()).toBe('No description');
      component.selectedEndpoint = endpointBefore;
    });

    it('should not show the scenario description if there is one set if the verb type is not set', () => {
      const componentMockDef = JSON.parse(
        JSON.stringify(component.mockDefinition)
      );
      const endpointBefore = JSON.parse(
        JSON.stringify(component.selectedEndpoint)
      );

      component.selectedEndpoint = componentMockDef;
      component.selectedEndpoint.path = '/pets';

      expect(component.getScenarioDescription()).toBe('No description');
      component.selectedEndpoint = endpointBefore;
    });

    it('should not show the scenario description if the path is invalid, but is text', () => {
      const componentMockDef = JSON.parse(
        JSON.stringify(component.mockDefinition)
      );
      const endpointBefore = JSON.parse(
        JSON.stringify(component.selectedEndpoint)
      );

      component.selectedEndpoint = componentMockDef;
      component.selectedEndpoint.path = '/does-not-exist';

      expect(component.getScenarioDescription()).toBe('No description');
      component.selectedEndpoint = endpointBefore;
    });
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
      expect(routerSpy).toHaveBeenCalledWith('scenario-editor');
    });
  });
  describe('ScenarioViewComponent.SearchBar', () => {
    describe('ScenarioViewComponent.scenarioToString', () => {
      it('should return the scenario title', () => {
        const scenario = component.mockDefinition.scenarios[0];
        const expected = component.mockDefinition.scenarios[0].metadata.title;
        expect(expected).toEqual(component.scenarioToString(scenario));
      });
      it('should return undefined result', () => {
        const scenario = null;
        expect(component.scenarioToString(scenario)).toBeUndefined();
      });
    });
    describe('ScenarioViewComponent.setFilteredList', () => {
      it('should set the filteredList property to equal the given array', () => {
        const expected = component.mockDefinition.scenarios;
        component.setFilteredList(expected);
        expect(component.filteredList).toEqual(expected);
      });
      it('should set the filtered list to an empty list when the filtered list is null', () => {
        const expected = null;
        component.setFilteredList(expected);
        expect(component.filteredList).toEqual([]);
      });
    });
    describe('ScenarioViewComponent.showNotFound', () => {
      it('should return true if have no filtered list', () => {
        const expected: Scenario[] = [];
        expect(component.showNotFound(expected)).toBeTruthy();
      });
    });
  });
});
