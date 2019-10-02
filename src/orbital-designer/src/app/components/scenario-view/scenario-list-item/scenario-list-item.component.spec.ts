import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ScenarioListItemComponent } from './scenario-list-item.component';
import { DesignerStore } from '../../../store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { ScenarioListComponent } from '../scenario-list/scenario-list.component';
import { AppModule } from 'src/app/app.module';

describe('ScenarioListItemComponent', () => {
  let component: ScenarioListItemComponent;
  let fixture: ComponentFixture<ScenarioListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
