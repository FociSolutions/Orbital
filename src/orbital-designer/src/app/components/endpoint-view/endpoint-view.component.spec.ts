import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointViewComponent } from './endpoint-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OverviewComponent } from '../overview/overview.component';
import SampleMockDefinition from '../../../test-files/test-mockdefinition-object';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { EndpointListItemComponent } from './endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { MatCardModule } from '@angular/material/card';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EndpointViewComponent', () => {
  let component: EndpointViewComponent;
  let fixture: ComponentFixture<EndpointViewComponent>;
  let store: DesignerStore;

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
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointViewComponent);
    component = fixture.componentInstance;
    store = TestBed.get(DesignerStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('EndpointViewComponent.showNotFound()', () => {
    beforeEach(() => {
      store.mockDefinition = SampleMockDefinition;
      fixture.detectChanges();
    });
    it('Should return false if endpoints list is not empty', () => {
      expect(component.showNotFound()).toBeFalsy();
    });

    it('Should return true if endpoints list is empty', () => {
      component.endpointList = [];
      fixture.detectChanges();
      expect(component.showNotFound()).toBeTruthy();
    });
  });
});
