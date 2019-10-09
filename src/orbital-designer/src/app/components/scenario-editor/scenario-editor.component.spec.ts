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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';
import { MatIconModule } from '@angular/material/icon';

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
        ScenarioCardComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule,
        MatButtonModule,
        MatExpansionModule,
        BrowserAnimationsModule,
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

  describe('ScenarioEditorComponent metadata card', () => {
    describe('ScenarioEditorComponent.handleCancelButtonClick', () => {
      it('should set the name and description panel\'s state to closed if handleCancelButtonClick is called', () => {
        component.handleCancelButtonClick();
        expect(component.nameDescriptionPanelExpanded).not.toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.handleNameDescriptionPanelOpen', () => {
      it('should set the name and description panel\'s state to open if handleNameDescriptionPanelOpen is called', () => {
        component.handleNameDescriptionPanelOpen();
        expect(component.nameDescriptionPanelExpanded).toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.nameDescriptionPanelExpanded property', () => {
      it('should ensure that the name and description panel\'s state is closed when initialized for the first time', () => {
        expect(component.nameDescriptionPanelExpanded).not.toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.saveButtonDisabledState', () => {
      it('should not save if nameAndDescriptionFormGroup is null', () => {
        component.nameAndDescriptionFormGroup = null;
        expect(component.saveButtonDisabledState()).toBeTruthy();
      });
    });
  });

  describe('ScenarioEditorComponent request match rules card', () => {
    describe('ScenarioEditorComponent.handleRequestMatchRulesPanelOpen', () => {
      it('should set the panel\'s state to closed if handleCancelButtonClick is called', () => {
        component.handleCancelButtonClickRequestMatchRules();
        expect(component.requestMatchRulesPanelExpanded).not.toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.handleRequestMatchRulesPanelClose', () => {
      it('should set the panel\'s state to open if handleRequestMatchRulesPanelClose is called', () => {
        component.handleRequestMatchRulesPanelClose();
        expect(component.requestMatchRulesPanelExpanded).not.toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.saveButtonDisabledStateRequestMatchRules', () => {
      it('should ensure that the panel\'s state cannot be saved for the first time when initialized', () => {
        expect(component.saveButtonDisabledStateRequestMatchRules()).toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.saveButtonDisabledStateRequestMatchRules', () => {
      it('should not save if responseFormGroup is null', () => {
        component.responseFormGroup = null;
        expect(component.saveButtonDisabledStateRequestMatchRules()).toBeTruthy();
      });
    });

    describe('ScenarioEditorComponent.saveButtonDisabledStateRequestMatchRules', () => {
      it('should not save if responseFormGroup is invalid', () => {
        component.responseFormGroup.controls['status']['statuscode'] = 'abc';
        expect(component.saveButtonDisabledStateRequestMatchRules()).toBeTruthy();
      });
    });
  });
});
