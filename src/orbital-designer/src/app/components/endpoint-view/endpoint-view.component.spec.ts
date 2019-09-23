import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointViewComponent } from './endpoint-view.component';
import {MatCardModule} from '@angular/material/card';
import { DesignerStore} from 'src/app/store/designer-store';
import { OverviewComponent } from './overview/overview.component';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';

describe('EndpointViewComponent', () => {
  let component: EndpointViewComponent;
  let store: DesignerStore;
  let fixture: ComponentFixture<EndpointViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointViewComponent, OverviewComponent ],
      imports: [ MatCardModule ],
      providers: [ DesignerStore ]
    })
    .compileComponents();
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
