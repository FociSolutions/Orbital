import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleListComponent } from './shuttle-list.component';
import { SearchableSelectionListComponent } from '../searchable-selection-list/searchable-selection-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

describe('ShuttleListComponent', () => {
  let component: ShuttleListComponent;
  let fixture: ComponentFixture<ShuttleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShuttleListComponent, SearchableSelectionListComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
