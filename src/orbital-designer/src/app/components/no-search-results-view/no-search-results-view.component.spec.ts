import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSearchResultsViewComponent } from './no-search-results-view.component';

describe('NoSearchResultsViewComponent', () => {
  let component: NoSearchResultsViewComponent;
  let fixture: ComponentFixture<NoSearchResultsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoSearchResultsViewComponent, NoSearchResultsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSearchResultsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
