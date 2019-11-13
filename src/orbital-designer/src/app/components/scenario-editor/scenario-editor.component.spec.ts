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
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';
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
        ScenarioCardComponent,
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

  it('should go back to the scenario-view when the button is pressed', () => {
    spyOn(component, 'goToScenarios');

    const button = fixture.debugElement.nativeElement.querySelector(
      'button#go-to-scenarios'
    );
    button.click();
    expect(component.goToScenarios).toHaveBeenCalled();
  });

  describe('ScenarioEditorComponent.handleCancelButtonClick', () => {
    it('should set the name and description panels state to closed if handleCancelButtonClick is called', () => {
      component.handleCancelButtonClick();
      expect(component.nameDescriptionPanelExpanded).not.toBeTruthy();
    });
  });

  describe('ScenarioEditorComponent.handleNameDescriptionPanelOpen', () => {
    it('should set the name and description panel state to open if handleNameDescriptionPanelOpen is called', () => {
      component.handleNameDescriptionPanelOpen();
      expect(component.nameDescriptionPanelExpanded).toBeTruthy();
    });
  });

  describe('ScenarioEditorComponent.nameDescriptionPanelExpanded property', () => {
    it('should ensure that the name and description panel state is closed when initialized for the first time', () => {
      expect(component.nameDescriptionPanelExpanded).not.toBeTruthy();
    });
  });
  describe('ScenarioEditorComponent metadata card', () => {
    describe('ScenarioEditorComponent.handleCancelButtonClick', () => {
      it('should set the name and description panel state to closed if handleCancelButtonClick is called', () => {
        component.handleCancelButtonClick();
        expect(component.nameDescriptionPanelExpanded).not.toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.handleNameDescriptionPanelOpen', () => {
      it('should set the name and description panel state to open if handleNameDescriptionPanelOpen is called', () => {
        component.handleNameDescriptionPanelOpen();
        expect(component.nameDescriptionPanelExpanded).toBeTruthy();
      });
    });

    it('should not save if nameAdDescriptionFormGroup name is empty', () => {
      component.nameAndDescriptionFormGroup.controls.name.setValue('');
      component.nameAndDescriptionFormGroup.controls.description.setValue('');
      expect(component.saveButtonDisabledState()).toBeTruthy();
    });

    it('should save if nameAndDescriptionFormGroups description is empty', () => {
      component.nameAndDescriptionFormGroup.controls.description.setValue('');
      component.nameAndDescriptionFormGroup.controls.name.setValue('test name');
      expect(component.saveButtonDisabledState()).not.toBeTruthy();
    });

    it('should save if nameAndDescriptionFormGroup name is not empty', () => {
      component.nameAndDescriptionFormGroup.controls.name.setValue('test name');
      component.nameAndDescriptionFormGroup.controls.description.setValue('');
      expect(component.saveButtonDisabledState()).not.toBeTruthy();
    });
    describe('ScenarioEditorComponent.nameDescriptionPanelExpanded property', () => {
      it('should ensure that the name and description panel state is closed when initialized for the first time', () => {
        expect(component.nameDescriptionPanelExpanded).not.toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.saveButtonDisabledState', () => {
      it('should not save if nameAndDescriptionFormGroup is null', () => {
        component.nameAndDescriptionFormGroup = null;
        expect(component.saveButtonDisabledState()).toBeTruthy();
      });
    });
    it('should save if nameAndDescriptionFormGroup name is only one character', () => {
      component.nameAndDescriptionFormGroup.controls.name.setValue('z');
      component.nameAndDescriptionFormGroup.controls.description.setValue('');
      expect(component.saveButtonDisabledState()).not.toBeTruthy();
    });

    it('should not save if nameAndDescriptionFormGroups name is more than 50 characters', () => {
      component.nameAndDescriptionFormGroup.controls.description.setValue('');
      component.nameAndDescriptionFormGroup.controls.name.setValue(
        'z'.repeat(52)
      );
      expect(component.saveButtonDisabledState()).toBeTruthy();
    });

    it('should not save if nameAndDescriptionFormGroups description is more than 50 characters', () => {
      component.nameAndDescriptionFormGroup.controls.name.setValue('');
      component.nameAndDescriptionFormGroup.controls.description.setValue(
        'z'.repeat(52)
      );
      expect(component.saveButtonDisabledState()).toBeTruthy();
    });

    it('should not save if nameAndDescriptionFormGroups name and description is more than 50 characters', () => {
      component.nameAndDescriptionFormGroup.controls.description.setValue('');
      component.nameAndDescriptionFormGroup.controls.name.setValue('');
      expect(component.saveButtonDisabledState()).toBeTruthy();
    });

    describe('ScenarioEditorComponent request match rules card', () => {
      describe('ScenarioEditorComponent.handleRequestMatchRulesPanelOpen', () => {
        it('should set the panel state to closed if handleCancelButtonClick is called', () => {
          component.handleCancelButtonClickRequestMatchRules();
          expect(component.requestMatchRulesPanelExpanded).not.toBeTruthy();
        });
      });

      describe('ScenarioEditorComponent.handleRequestMatchRulesPanelClose', () => {
        it('should set the panel state to open if handleRequestMatchRulesPanelClose is called', () => {
          component.handleRequestMatchRulesPanelClose();
          expect(component.requestMatchRulesPanelExpanded).not.toBeTruthy();
        });
      });

      describe('ScenarioEditorComponent.saveButtonDisabledStateRequestMatchRules', () => {
        it('should ensure that the panel state cannot be saved for the first time when initialized', () => {
          expect(
            component.saveButtonDisabledStateRequestMatchRules()
          ).toBeTruthy();
        });
      });

      describe('ScenarioEditorComponent.saveButtonDisabledStateRequestMatchRules', () => {
        it('should not save if responseFormGroup is null', () => {
          component.responseFormGroup = null;
          expect(
            component.saveButtonDisabledStateRequestMatchRules()
          ).toBeTruthy();
        });
      });
    });
  });

  describe('ScenarioEditorComponent.handleMetadataOutput', () => {
    it('should set the metadata to the metadata when the component outputs the metadata', () => {
      const fakeMetadata = { title: faker.random.word(), description: faker.random.word() } as Metadata;
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
    it('should set the response to the response when the component outputs the response', () => {
      component.selectedScenario = validMockDefinition.scenarios[0];
      const fakeResponse = validMockDefinition.scenarios[0].response as unknown as Response;
      component.handleResponseOutput(fakeResponse);
      expect(component.response).toEqual(fakeResponse);
    });
  });

  describe('ScenarioEditorComponent.saveScenario', () => {
    it('should save the scenario if all the fields are valid', () => {
      const store = TestBed.get(DesignerStore);
      store.state.mockDefinition = JSON.parse(JSON.stringify(validMockDefinition));
      component.scenarioId = validMockDefinition.scenarios[0].id;
      const fakeMetadata = { title: faker.random.word(), description: faker.random.word() } as unknown as Metadata;
      component.metadata = JSON.parse(JSON.stringify(fakeMetadata));

      component.metadataMatchRuleValid = true;
      component.requestMatchRuleValid = true;
      component.responseMatchRuleValid = true;
      component.response = {} as Response;
      component.requestMatchRule = {} as RequestMatchRule;
      component.saveScenario();

      expect(store.state.mockDefinition.scenarios[0].metadata).toEqual(fakeMetadata);
    });

    it('should save a new scenario if all the fields are valid', () => {
      const store = TestBed.get(DesignerStore);
      store.state.mockDefinition = JSON.parse(JSON.stringify(validMockDefinition));
      const prevStoreScenarioLength = store.state.mockDefinition.scenarios.length;
      component.scenarioId = validMockDefinition.scenarios[0].id + '-new';
      const fakeMetadata = { title: faker.random.word(), description: faker.random.word() } as unknown as Metadata;
      component.metadata = JSON.parse(JSON.stringify(fakeMetadata));

      component.metadataMatchRuleValid = true;
      component.requestMatchRuleValid = true;
      component.responseMatchRuleValid = true;
      component.response = {} as Response;
      component.requestMatchRule = {} as RequestMatchRule;
      component.saveScenario();

      expect(store.state.mockDefinition.scenarios.length).toEqual(prevStoreScenarioLength + 1);
    });
  });

  describe('ScenarioEditorComponent.save', () => {
    it('should set the shouldSave variable to true', () => {
      component.save();
      expect(component.shouldSave).toBe(true);
    });
  });
});
