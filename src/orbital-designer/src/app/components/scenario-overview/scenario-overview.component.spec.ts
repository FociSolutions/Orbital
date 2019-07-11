import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { ScenarioOverviewComponent } from './scenario-overview.component';
import { ScenarioDetailsComponent } from './scenario-details/scenario-details.component';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color.pipe';
import { AppStore } from 'src/app/store/app-store';
import { VerbType } from 'src/app/models/verb.type';
import { Endpoint } from 'src/app/models/endpoint.model';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';

describe('ScenarioOverviewComponent', () => {
  let component: ScenarioOverviewComponent;
  let fixture: ComponentFixture<ScenarioOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      declarations: [
        ScenarioOverviewComponent,
        ScenarioDetailsComponent,
        GetVerbColorPipe
      ],
      providers: [AppStore, ToastrService, MockDefinitionStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup a new default scenario for the selected scenario', () => {
    const mockEndpoint: Endpoint = {
      verb: faker.random.arrayElement([
        VerbType.GET,
        VerbType.POST,
        VerbType.PUT,
        VerbType.DELETE
      ]),
      path: faker.internet.domainSuffix(),
      spec: null
    };
    const appStore: AppStore = TestBed.get(AppStore);
    appStore.selectedEndpoint = mockEndpoint;
    expect(appStore.state.selectedScenario).toBeFalsy();
    component.onAdd();
    expect(appStore.state.selectedScenario).toBeTruthy();
    expect(appStore.state.showEditor).toBeTruthy();
  });
});
