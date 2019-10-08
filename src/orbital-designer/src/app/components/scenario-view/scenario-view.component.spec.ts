import { Endpoint } from './../../models/endpoint.model';
import {
  Scenario,
  newScenario
} from './../../models/mock-definition/scenario/scenario.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { ScenarioViewComponent } from './scenario-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { ScenarioListComponent } from './scenario-list/scenario-list.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ScenarioListItemComponent } from './scenario-list-item/scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { OverviewComponent } from '../overview/overview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { VerbType } from 'src/app/models/verb.type';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import validOpenApiText from '../../../test-files/valid-openapi-spec';
import { By } from '@angular/platform-browser';
import testMockdefinitionFileMock from 'src/test-files/test-mockdefinition-file.mock';
import testMockdefinitionObject from 'src/test-files/test-mockdefinition-object';
import { MatMenuModule } from '@angular/material/menu';

describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioViewComponent,
        ScenarioListComponent,
        ScenarioListItemComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        OverviewComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule,
        MatMenuModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    component.mockDefinition = testMockdefinitionObject;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show any scenarios if there are no scenarios to show', () => {
    expect(
      fixture.debugElement.query(By.css('app-scenario-list mat-list'))
        .nativeNode.childNodes[0].childNodes.length
    ).toBe(0);
  });
});
