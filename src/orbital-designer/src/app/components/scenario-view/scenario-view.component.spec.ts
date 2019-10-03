import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
      imports: [LoggerTestingModule, MatCardModule, OrbitalCommonModule, RouterTestingModule],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
