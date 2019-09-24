import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { SearchableListComponent } from './searchable-list.component';
import { MatIconModule } from '@angular/material/icon';

describe('SearchableListComponent', () => {
  let component: SearchableListComponent;
  let fixture: ComponentFixture<SearchableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableListComponent],
      imports: [MatIconModule]
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
