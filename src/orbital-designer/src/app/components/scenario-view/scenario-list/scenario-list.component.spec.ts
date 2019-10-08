import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioListComponent } from './scenario-list.component';
import { MatListModule } from '@angular/material/list';
import { ScenarioListItemComponent } from '../scenario-list-item/scenario-list-item.component';
import { DialogBoxComponent } from '../../orbital-common/dialog-box/dialog-box.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

describe('ScenarioListComponent', () => {
  let component: ScenarioListComponent;
  let fixture: ComponentFixture<ScenarioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioListComponent,
        ScenarioListItemComponent,
        DialogBoxComponent
      ],
      imports: [MatListModule, MatCardModule, MatMenuModule, MatIconModule]
    }).compileComponents();
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
