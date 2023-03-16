import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScenarioEditorComponent } from './scenario-editor.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignerStore } from 'src/app/store/designer-store';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MetadataFormComponent } from './metadata-form/metadata-form.component';
import { ResponseFormComponent } from './response-form/response-form.component';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { OverviewHeaderComponent } from '../../shared/components/overview-header/overview-header.component';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { GetVerbStringPipe } from '../../pipes/get-verb-string/get-verb-string.pipe';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';
import { Scenario, emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { PoliciesFormComponent } from './policies-form/policies-form.component';
import { PolicyFormComponent } from './policies-form/policy-form/policy-form.component';
import { ExportMockdefinitionService } from 'src/app/services/export-mockdefinition/export-mockdefinition.service';
import { ScenarioViewComponent } from '../scenario-view/scenario-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { JsonEditorComponent } from 'ang-jsoneditor';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { RequestFormComponent } from './request-form/request-form.component';
import validMockDefinition from 'src/test-files/test-mockdefinition-object';
import { faker } from '@faker-js/faker';

describe('ScenarioEditorComponent', () => {
  let component: ScenarioEditorComponent;
  let fixture: ComponentFixture<ScenarioEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ScenarioEditorComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        OverviewHeaderComponent,
        MetadataFormComponent,
        ResponseFormComponent,
        GetVerbColorPipe,
        GetVerbStringPipe,
        GetRuleTypeStringPipe,
        PoliciesFormComponent,
        PolicyFormComponent,
        RequestFormComponent,
        JsonEditorComponent,
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        SharedModule,
        RouterTestingModule.withRoutes([{ path: 'scenario-view', component: ScenarioViewComponent }]),
        MatButtonModule,
        MatTabsModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
      ],
      providers: [DesignerStore, ExportMockdefinitionService, MockDefinitionService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioEditorComponent);
    component = fixture.componentInstance;
    component.selectedScenario = emptyScenario;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ScenarioEditorComponent.save', () => {
    it('should save the scenario if all the fields are valid', fakeAsync(() => {
      fixture.ngZone?.run(() => {
        const store: DesignerStore = TestBed.inject(DesignerStore);
        store.state.mockDefinition = validMockDefinition;

        const scenario: Scenario = {
          ...validMockDefinition.scenarios[0],
          metadata: {
            title: faker.random.word(),
            description: faker.random.word(),
          },
        };

        component.scenarioId = scenario.id;
        component.selectedScenario = scenario;
        component.scenarioForm.setValue(component.convertScenarioToFormData(scenario));
        component.scenarioForm.markAsDirty();

        component.save();

        const actual = store.state.mockDefinition.scenarios.find((s) => s.id === scenario.id);
        expect(actual).toBeTruthy();
        expect(actual?.metadata.title).toEqual(scenario.metadata.title);
      });
    }));

    it('should not save the scenario if the form id invalid', fakeAsync(() => {
      fixture.ngZone?.run(() => {
        const store: DesignerStore = TestBed.inject(DesignerStore);
        store.state.mockDefinition = validMockDefinition;

        const scenario: Scenario = {
          ...validMockDefinition.scenarios[0],
          metadata: {
            title: '',
            description: faker.random.word(),
          },
        };

        component.scenarioId = scenario.id;
        component.selectedScenario = scenario;
        component.scenarioForm.setValue(component.convertScenarioToFormData(scenario));

        component.save();

        const actual = store.state.mockDefinition.scenarios.find((s) => s.id === scenario.id);
        expect(actual).toBeTruthy();
        expect(actual?.metadata.title).toEqual(validMockDefinition.scenarios[0].metadata.title);
      });
    }));
  });

  describe('ScenarioEditorComponent.cancel', () => {
    it('should set the triggerOpenCancelBox to true when cancelled with a dirty form', () => {
      component.scenarioForm.markAsDirty();
      component.cancel();
      expect(component.triggerOpenCancelBox).toBe(true);
    });

    it('should not set the triggerOpenCancelBox to true when cancelled with a clean form', () => {
      fixture.ngZone?.run(() => {
        component.cancel();
        expect(component.triggerOpenCancelBox).toBe(false);
      });
    });

    it('should set triggerOpenCancelBox to false when onCancelDialogAction is false', fakeAsync(() => {
      fixture.ngZone?.run(() => {
        component.onCancelDialogAction(false);
        tick();
        fixture.detectChanges();
        expect(component.triggerOpenCancelBox).toBe(false);
      });
    }));
  });
});
