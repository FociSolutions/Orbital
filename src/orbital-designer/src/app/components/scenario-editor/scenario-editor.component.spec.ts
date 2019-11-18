import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioEditorComponent } from './scenario-editor.component';
import { ScenarioListComponent } from '../scenario-view/scenario-list/scenario-list.component';
import { ScenarioListItemComponent } from '../scenario-view/scenario-list-item/scenario-list-item.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { OverviewComponent } from '../overview/overview.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import {
  MatCardModule,
  MatButtonModule,
  MatExpansionModule
} from '@angular/material';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignerStore } from 'src/app/store/designer-store';

import { MatMenuModule } from '@angular/material/menu';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { AddBodyRuleContainerComponent } from './add-body-rule-container/add-body-rule-container.component';
import { AddBodyRuleComponent } from './add-body-rule-container/add-body-rule/add-body-rule.component';
import { BodyRuleListItemComponent } from './add-body-rule-container/body-rule-list-item/body-rule-list-item.component';
import { AddMetadataComponent } from './add-metadata/add-metadata.component';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import * as faker from 'faker';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { AddRequestMatchRuleComponent } from './add-request-match-rule/add-request-match-rule.component';
import { AddResponseComponent } from './add-response/add-response.component';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Endpoint } from 'src/app/models/endpoint.model';
import { VerbType } from 'src/app/models/verb.type';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

describe('ScenarioEditorComponent', () => {
  let component: ScenarioEditorComponent;
  let fixture: ComponentFixture<ScenarioEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioEditorComponent,
        ScenarioListComponent,
        ScenarioListItemComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        OverviewComponent,
        AddBodyRuleContainerComponent,
        AddBodyRuleComponent,
        BodyRuleListItemComponent,
        AddMetadataComponent,
        AddRequestMatchRuleComponent,
        AddResponseComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule,
        MatButtonModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatIconModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ScenarioEditorComponent.handleMetadataOutput', () => {
    it('should set the metadata to the metadata when the component outputs the metadata', () => {
      const fakeMetadata = {
        title: faker.random.word(),
        description: faker.random.word()
      } as Metadata;
      component.handleMetadataOutput(fakeMetadata);
      expect(component.metadata).toEqual(fakeMetadata);
    });
  });

  describe('ScenarioEditorComponent.handleRequestMatchRuleOutput', () => {
    it('should set the request match rule to the one that the component emitted', () => {
      const fakeRequestMatchRule =
        validMockDefinition.scenarios[0].requestMatchRules;
      component.handleRequestMatchRuleOutput(fakeRequestMatchRule);
      expect(component.requestMatchRule).toEqual(fakeRequestMatchRule);
    });
  });

  describe('ScenarioEditorComponent.handleResponseOutput', () => {
    it('should set the response to the response when the component outputs the response', () => {
      component.selectedScenario = validMockDefinition.scenarios[0];
      const fakeResponse = (validMockDefinition.scenarios[0]
        .response as unknown) as Response;
      component.handleResponseOutput(fakeResponse);
      expect(component.response).toEqual(fakeResponse);
    });
  });

  describe('ScenarioEditorComponent.saveScenario', () => {
    it('should save the scenario if all the fields are valid', () => {
      const store = TestBed.get(DesignerStore);
      store.state.mockDefinition = JSON.parse(
        JSON.stringify(validMockDefinition)
      );
      component.scenarioId = validMockDefinition.scenarios[0].id;
      const fakeMetadata = ({
        title: faker.random.word(),
        description: faker.random.word()
      } as unknown) as Metadata;
      component.metadata = JSON.parse(JSON.stringify(fakeMetadata));

      component.metadataMatchRuleValid = true;
      component.requestMatchRuleValid = true;
      component.responseMatchRuleValid = true;
      component.response = {} as Response;
      component.requestMatchRule = {} as RequestMatchRule;
      component.saveScenario();

      expect(store.state.mockDefinition.scenarios[0].metadata).toEqual(
        fakeMetadata
      );
    });

    it('should save a new scenario if all the fields are valid', () => {
      const store = TestBed.get(DesignerStore);
      store.state.mockDefinition = JSON.parse(
        JSON.stringify(validMockDefinition)
      );
      store.state.selectedScenario = validMockDefinition.scenarios[0];
      store.state.selectedEndpoint = {
        path: 'test-path',
        verb: VerbType.GET
      } as Endpoint; // does not have a spec; just for testing
      const prevStoreScenarioLength =
        store.state.mockDefinition.scenarios.length;
      component.scenarioId = validMockDefinition.scenarios[0].id + '-new';
      const fakeMetadata = ({
        title: faker.random.word(),
        description: faker.random.word()
      } as unknown) as Metadata;
      component.metadata = JSON.parse(JSON.stringify(fakeMetadata));

      component.metadataMatchRuleValid = true;
      component.requestMatchRuleValid = true;
      component.responseMatchRuleValid = true;
      component.response = {} as Response;
      component.requestMatchRule = {} as RequestMatchRule;
      component.saveScenario();

      expect(store.state.mockDefinition.scenarios.length).toEqual(
        prevStoreScenarioLength + 1
      );
    });
  });

  describe('ScenarioEditorComponent.save', () => {
    it('should set the shouldSave variable to true', () => {
      component.save();
      expect(component.shouldSave).toBe(true);
    });
  });

  describe('ScenarioEditorComponent.cancel', () => {
    it('should set the triggerOpenCancelBox to true when cancelled', () => {
      component.cancel();
      expect(component.triggerOpenCancelBox).toBe(true);
    });

    it('should set triggerOpenCancelBox to false when onCancelDialogAction is true', () => {
      component.onCancelDialogAction(true);
      expect(component.triggerOpenCancelBox).toBe(false);
    });

    it('should set triggerOpenCancelBox to false when onCancelDialogAction is false', () => {
      component.onCancelDialogAction(false);
      expect(component.triggerOpenCancelBox).toBe(false);
    });
  });
});
