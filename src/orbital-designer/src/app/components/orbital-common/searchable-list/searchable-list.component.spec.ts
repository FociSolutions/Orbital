import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableListComponent } from './searchable-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

describe('SearchableListComponent', () => {
  let component: SearchableListComponent;
  let fixture: ComponentFixture<SearchableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableListComponent],
      imports: [MatIconModule, MatListModule, MatCardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
