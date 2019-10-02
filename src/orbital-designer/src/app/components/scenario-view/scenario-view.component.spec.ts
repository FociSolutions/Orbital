import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioViewComponent } from './scenario-view.component';
import { ScenarioListItemComponent } from './scenario-list-item/scenario-list-item.component';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { OverviewComponent } from '../overview/overview.component';
import { ScenarioListComponent } from './scenario-list/scenario-list.component';
import { MatCardModule } from '@angular/material/card';
import { DesignerStore } from '../../store/designer-store';
import { LoggerModule } from 'ngx-logger';
import { HttpBackend } from '@angular/common/http';
import { AppModule } from '../../app.module';
describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
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
