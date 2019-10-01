import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioListComponent } from './scenario-list.component';
import { ScenarioListItemComponent } from '../scenario-list-item/scenario-list-item.component';
import {MatListModule} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { DesignerStore } from '../../../store/designer-store';
import { LoggerModule } from 'ngx-logger';
import { HttpBackend } from '@angular/common/http';
import { AppModule } from '../../../app.module';
describe('ScenarioListComponent', () => {
  let component: ScenarioListComponent;
  let fixture: ComponentFixture<ScenarioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
