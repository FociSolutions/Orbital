import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointViewComponent } from './endpoint-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OverviewComponent } from '../overview/overview.component';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { EndpointListItemComponent } from './endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { MatCardModule } from '@angular/material/card';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('EndpointViewComponent', () => {
  let component: EndpointViewComponent;
  let fixture: ComponentFixture<EndpointViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndpointViewComponent,
        OverviewComponent,
        EndpointListComponent,
        EndpointListItemComponent,
        SideBarComponent,
        GetEndpointScenariosPipe
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
