import { ComponentFixture, TestBed, fakeAsync, tick, flush, waitForAsync } from '@angular/core/testing';

import { ScenarioEditorComponent } from './scenario-editor.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignerStore } from 'src/app/store/designer-store';

import { MatMenuModule } from '@angular/material/menu';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { AddMetadataComponent } from './add-metadata/add-metadata.component';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import * as faker from 'faker';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { AddRequestMatchRuleComponent } from './add-request-match-rule/add-request-match-rule.component';
import { AddResponseComponent } from './add-response/add-response.component';
import { SideBarComponent } from '../orbital-common/side-bar/side-bar.component';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { OverviewHeaderComponent } from '../orbital-common/overview-header/overview-header.component';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { GetVerbStringPipe } from '../../pipes/get-verb-string/get-verb-string.pipe';
import { KvpEditRuleComponent } from './kvp-edit-rule/kvp-edit-rule.component';
import { KvpListItemRuleTypeComponent } from './kvp-edit-rule/kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';
import { UrlAddRuleComponent } from './url-edit-rule/url-add-rule/url-add-rule.component';
import { UrlEditRuleComponent } from './url-edit-rule/url-edit-rule.component';
import { UrlListItemRuleTypeComponent } from './url-edit-rule/url-list-item-rule-type/url-list-item-rule-type.component';
import { ScenarioFormBuilder } from './scenario-form-builder/scenario-form.builder';
import { FormGroup, FormArray } from '@angular/forms';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { PolicyComponent } from './policy-container/policy/policy.component';
import { PolicyAddComponent } from './policy-container/policy-add/policy-add.component';
import { PolicyEditComponent } from './policy-container/policy-edit/policy-edit.component';
import { ExportMockdefinitionService } from 'src/app/services/export-mockdefinition/export-mockdefinition.service';
import { BodyListItemRuleTypeComponent } from './add-body-rule-edit/body-list-item-rule-type/body-list-item-rule-type.component';
import { BodyAddRuleComponent } from './add-body-rule-edit/body-add-rule/body-add-rule.component';
import { BodyEditRuleComponent } from './add-body-rule-edit/body-edit-rule.component';
import { ScenarioViewComponent } from '../scenario-view/scenario-view.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AddTokenValidationRuleComponent } from './add-token-validation-rule/add-token-validation-rule.component';

describe('ScenarioEditorComponent', () => {
  let component: ScenarioEditorComponent;
  let fixture: ComponentFixture<ScenarioEditorComponent>;
  let scenarioBuilder: ScenarioFormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioEditorComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        OverviewHeaderComponent,
        AddMetadataComponent,
        AddRequestMatchRuleComponent,
        AddResponseComponent,
        GetVerbColorPipe,
        GetVerbStringPipe,
        KvpEditRuleComponent,
        KvpListItemRuleTypeComponent,
        GetRuleTypeStringPipe,
        UrlAddRuleComponent,
        UrlEditRuleComponent,
        UrlListItemRuleTypeComponent,
        PolicyComponent,
        PolicyAddComponent,
        PolicyEditComponent,
        BodyEditRuleComponent,
        BodyListItemRuleTypeComponent,
        BodyAddRuleComponent,
        ScenarioViewComponent,
        AddTokenValidationRuleComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule.withRoutes([{ path: 'scenario-view', component: ScenarioViewComponent }]),
        MatButtonModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        NgJsonEditorModule,
      ],
      providers: [DesignerStore, ScenarioFormBuilder, ExportMockdefinitionService],
    }).compileComponents();

    fixture = TestBed.createComponent(ScenarioEditorComponent);
    component = fixture.componentInstance;
    scenarioBuilder = TestBed.get(ScenarioFormBuilder);
    component.scenarioFormGroup = scenarioBuilder.createNewScenarioForm();
    component.selectedScenario = emptyScenario;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ScenarioEditorComponent.handleMetadataOutput', () => {
    it('should set the metadata to the metadata when the component outputs the metadata', () => {
      const fakeMetadata = {
        title: faker.random.word(),
        description: faker.random.word(),
      } as Metadata;
      component.handleMetadataOutput(fakeMetadata);
      expect(component.metadata).toEqual(fakeMetadata);
    });
  });

  describe('ScenarioEditorComponent.handleRequestMatchRuleOutput', () => {
    it('should set the request match rule to the one that the component emitted', () => {
      const fakeRequestMatchRule = validMockDefinition.scenarios[0].requestMatchRules;
      component.handleRequestMatchRuleOutput(fakeRequestMatchRule);
      expect(component.requestMatchRule).toEqual(fakeRequestMatchRule);
    });
  });

  describe('ScenarioEditorComponent.handleResponseOutput', () => {
    it('should set the response to the response when the component outputs the response', fakeAsync(() => {
      component.selectedScenario = validMockDefinition.scenarios[0];
      const fakeResponse = (validMockDefinition.scenarios[0].response as unknown) as Response;
      component.handleResponseOutput(fakeResponse);
      tick();
      fixture.detectChanges();
      expect(component.response).toEqual(fakeResponse);
    }));
  });

  describe('ScenarioEditorComponent.saveScenario', () => {
    it('should save the scenario if all the fields are valid', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const store: DesignerStore = TestBed.get(DesignerStore);
        store.state.mockDefinition = validMockDefinition;

        const input = {
          scenario: validMockDefinition.scenarios[0],
          metadata: {
            title: faker.random.word(),
            description: faker.random.word(),
          } as Metadata,
        };
        component.scenarioId = input.scenario.id;
        component.metadata = input.metadata;
        component.response = input.scenario.response;
        component.requestMatchRule = input.scenario.requestMatchRules;
        component.selectedScenario = input.scenario;

        component.metadataMatchRuleValid = true;
        component.requestMatchRuleValid = true;
        component.responseMatchRuleValid = true;
        ((component.scenarioFormGroup.controls.requestMatchRules as FormGroup).controls
          .urlMatchRules as FormArray).controls = input.scenario.requestMatchRules.urlRules.map((ur) =>
          scenarioBuilder.getUrlItemFormGroup(ur)
        );

        component.saveScenario();
        tick();
        fixture.detectChanges();
        const actual = store.state.mockDefinition.scenarios.find((s) => s.id === input.scenario.id);
        expect(actual).toBeTruthy();
        expect(actual.metadata.title).toEqual(input.metadata.title);
      });
    }));
  });

  describe('ScenarioEditorComponent.save', () => {
    it('should set the shouldSave variable to true', async () => {
      await component.save();
      fixture.detectChanges();
      expect(component.shouldSave).toBe(true);
    });
  });

  describe('ScenarioEditorComponent.cancel', () => {
    it('should set the triggerOpenCancelBox to true when cancelled', () => {
      component.cancel();
      expect(component.triggerOpenCancelBox).toBe(true);
    });

    it('should set triggerOpenCancelBox to false when onCancelDialogAction is false', fakeAsync(() => {
      fixture.ngZone.run(() => {
        component.onCancelDialogAction(false);
        tick();
        fixture.detectChanges();
        expect(component.triggerOpenCancelBox).toBe(false);
      });
    }));
  });
});
