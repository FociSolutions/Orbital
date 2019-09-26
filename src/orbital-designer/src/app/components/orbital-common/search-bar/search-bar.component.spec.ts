import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SearchBarComponent.onSearch', () => {
    it("should remove any items that don't match the criteria", done => {
      const unfilteredList: string[] = faker.random.words().split(' ');
      component.list = unfilteredList;
      component.filteredList.subscribe(filteredList => {
        expect(filteredList.findIndex(item => item === unfilteredList[0])).toBe(
          -1
        );
        done();
      });
      component.onSearchInput(unfilteredList[0] + 'sample');
    });
  });
});
