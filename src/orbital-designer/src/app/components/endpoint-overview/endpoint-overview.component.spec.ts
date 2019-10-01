import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { EndpointOverviewComponent } from './endpoint-overview.component';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { EndpointListItemComponent } from './endpoint-list-item/endpoint-list-item.component';
import { ScenarioOverviewComponent } from '../scenario-overview/scenario-overview.component';
import { NbCardModule } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { EditScenarioComponent } from '../edit-scenario/edit-scenario.component';
import { EndpointsStore } from 'src/app/store/endpoints-store';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color.pipe';
import { ScenarioDetailsComponent } from '../scenario-overview/scenario-details/scenario-details.component';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { KeyValueListComponent } from '../edit-scenario/key-value-list/key-value-list.component';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/store/app-store';
import { ScenarioViewComponent } from '../scenario-overview/scenario-view/scenario-view.component';
import { AutocompleteInputComponent } from '../edit-scenario/key-value-list/autocomplete-input/autocomplete-input.component';
import {MatAutocompleteModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrbitalServerService } from 'src/app/services/orbital-server.service';
import { Subject } from 'rxjs';
import testMockDefinition from '../../../test-files/test-mockdefinition-object';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import Json from 'src/app/models/json';

describe('EndpointOverviewComponent', () => {
  let component: EndpointOverviewComponent;
  let fixture: ComponentFixture<EndpointOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndpointOverviewComponent,
        EndpointListComponent,
        EndpointListItemComponent,
        ScenarioOverviewComponent,
        ScenarioViewComponent,
        EditScenarioComponent,
        GetEndpointScenariosPipe,
        GetVerbColorPipe,
        ScenarioDetailsComponent,
        KeyValueListComponent,
        AutocompleteInputComponent
      ],

      imports: [RouterTestingModule, NbCardModule, HttpClientTestingModule, MatAutocompleteModule, BrowserAnimationsModule],
      providers: [
        EndpointsStore,
        MockDefinitionStore,
        AppStore,
        OrbitalServerService,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the home page on back', () => {
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    component.onBack();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  describe('EndpointOverviewComponent.onServerExport()', () => {
    it('should show a successful alert on completion', () => {
      const subject = new Subject();
      const orbitalServiceSpy = spyOn(
        TestBed.get(OrbitalServerService),
        'onServerExport'
      ).and.returnValue(subject.asObservable());
      spyOn(window, 'alert');
      component.mockDefinition = testMockDefinition;
      component.onServerExport();
      subject.next('');
      expect(window.alert).toHaveBeenCalledWith(
        'The export has been sent successfully!'
      );
    });

    it('should show an unsuccesful alert on completion', () => {
      const subject = new Subject();
      const orbitalServiceSpy = spyOn(
        TestBed.get(OrbitalServerService),
        'onServerExport'
      ).and.returnValue(subject.asObservable());
      spyOn(window, 'alert');
      component.mockDefinition = testMockDefinition;
      component.onServerExport();
      subject.error(new Error());
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe('EndpointOverviewComponent.exportMockDefinition', () => {
    it('should return a blob of the mock definition', async () => {
      component.mockDefinition = testMockDefinition;
      const blob = component.exportMockDefinition();
      const filereader = new FileReader();
      await new Promise(resolve => {
        filereader.onloadend = () => resolve();
        filereader.readAsText(blob);
      });
      // tslint:disable-next-line: semicolon
      const Actual = await MockDefinition.toMockDefinition(
        filereader.result as string
      );
      /* I have to change the maps to objects because for some reason the tests are parsing
       the headers, headerRules, and queryRules as Objects. Even though they are initiated with new Map()
       in ../../../test-files/test-mockdefinition-object
       */
      expect(Json.mapToObject(Actual)).toEqual(component.mockDefinition);
    });
  });
});
