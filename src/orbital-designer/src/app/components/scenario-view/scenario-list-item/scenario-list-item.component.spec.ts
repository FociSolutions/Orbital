import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioListItemComponent } from './scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('ScenarioListItemComponent', () => {
  let component: ScenarioListItemComponent;
  let fixture: ComponentFixture<ScenarioListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioListItemComponent],
      imports: [MatCardModule, LoggerTestingModule]
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
