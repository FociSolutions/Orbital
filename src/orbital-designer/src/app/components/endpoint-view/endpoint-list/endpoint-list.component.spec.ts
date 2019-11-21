import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointListComponent } from './endpoint-list.component';
import { DesignerStore } from '../../../store/designer-store';
import SampleMockDefinition from '../../../../test-files/test-mockdefinition-object';
import { MatListModule } from '@angular/material/list';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { EndpointListItemComponent } from '../endpoint-list-item/endpoint-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';

describe('EndpointListComponent', () => {
  let component: EndpointListComponent;
  let fixture: ComponentFixture<EndpointListComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndpointListComponent,
        EndpointListItemComponent,
        GetEndpointScenariosPipe
      ],
      imports: [MatListModule, MatCardModule, LoggerTestingModule],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListComponent);
    component = fixture.componentInstance;
    store = TestBed.get(DesignerStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('EndpointListComponent.GetScenarios', () => {
    beforeEach(() => {
      store.mockDefinition = SampleMockDefinition;
      fixture.detectChanges();
    });
    it('Should return a list of scenarios from the store', () => {
      expect(component.scenarios).toEqual(store.state.mockDefinition.scenarios);
    });
  });
});
