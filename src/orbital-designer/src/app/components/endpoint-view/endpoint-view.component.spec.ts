import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointViewComponent } from './endpoint-view.component';
import { MatCardModule } from '@angular/material/card';
import { DesignerStore } from 'src/app/store/designer-store';
import { OverviewComponent } from './overview/overview.component';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { GetEndpointScenariosPipe } from '../../pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { EndpointListItemComponent } from './endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent} from '../side-bar/side-bar.component';

describe('EndpointViewComponent', () => {
  let component: EndpointViewComponent;
  let store: DesignerStore;
  let fixture: ComponentFixture<EndpointViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndpointViewComponent,
        OverviewComponent,
        EndpointListComponent,
        EndpointListItemComponent,
        GetEndpointScenariosPipe,
        SideBarComponent
      ],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        MatGridListModule,
        LoggerTestingModule,
        MatDividerModule,
        MatIconModule,
        MatListModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointViewComponent);
    component = fixture.componentInstance;
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition as MockDefinition;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
