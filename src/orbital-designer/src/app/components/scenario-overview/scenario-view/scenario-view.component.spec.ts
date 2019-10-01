import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioViewComponent } from './scenario-view.component';
import { EndpointOverviewComponent } from '../../endpoint-overview/endpoint-overview.component';
import { ScenarioOverviewComponent } from '../scenario-overview.component';
import { EndpointListItemComponent } from '../../endpoint-overview/endpoint-list-item/endpoint-list-item.component';
import { EndpointListComponent } from '../../endpoint-overview/endpoint-list/endpoint-list.component';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios.pipe';
import { EditScenarioComponent } from '../../edit-scenario/edit-scenario.component';
import { KeyValueListComponent } from '../../edit-scenario/key-value-list/key-value-list.component';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color.pipe';
import { ScenarioDetailsComponent } from '../scenario-details/scenario-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NbCardModule } from '@nebular/theme';
import { EndpointsStore } from 'src/app/store/endpoints-store';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { AppStore } from 'src/app/store/app-store';
import { AutocompleteInputComponent } from '../../edit-scenario/key-value-list/autocomplete-input/autocomplete-input.component';
import { MatAutocompleteModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndpointOverviewComponent,
        EndpointListComponent,
        EndpointListItemComponent,
        ScenarioViewComponent,
        ScenarioOverviewComponent,
        EditScenarioComponent,
        GetEndpointScenariosPipe,
        GetVerbColorPipe,
        ScenarioDetailsComponent,
        KeyValueListComponent,
        AutocompleteInputComponent
      ],
      imports: [RouterTestingModule, NbCardModule, MatAutocompleteModule, BrowserAnimationsModule],
      providers: [EndpointsStore, MockDefinitionStore, AppStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
