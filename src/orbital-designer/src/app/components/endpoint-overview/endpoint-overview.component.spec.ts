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
        KeyValueListComponent
      ],
      imports: [RouterTestingModule, NbCardModule],
      providers: [EndpointsStore, MockDefinitionStore, AppStore]
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
});
