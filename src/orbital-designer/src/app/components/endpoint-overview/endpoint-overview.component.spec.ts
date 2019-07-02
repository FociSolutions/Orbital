import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointOverviewComponent } from './endpoint-overview.component';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { EndpointListItemComponent } from './endpoint-list-item/endpoint-list-item.component';
import { ScenarioOverviewComponent } from '../scenario-overview/scenario-overview.component';
import { NbCardModule } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { EditScenarioComponent } from '../edit-scenario/edit-scenario.component';
import { EndpointsStore } from 'src/app/store/endpoints-store';

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
        EditScenarioComponent
      ],
      imports: [RouterTestingModule, NbCardModule],
      providers: [EndpointsStore]
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
});
