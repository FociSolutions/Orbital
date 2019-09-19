import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { SearchableSelectionListComponent } from './searchable-selection-list.component';
import { MatIconModule } from '@angular/material/icon';
import {
  MatListModule,
  MatSelectionList,
  MatSelectionListChange
} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

describe('SearchableSelectionListComponent', () => {
  let component: SearchableSelectionListComponent;
  let fixture: ComponentFixture<SearchableSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableSelectionListComponent],
      imports: [MatIconModule, MatListModule, MatCardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SearchableSelectionListComponent.getSearchedList()', () => {
    it('should return the original list if nothing is entered in the input', () => {
      component.list = faker.random.words().split(' ');
      expect(component.getSearchedList()).toEqual(component.list);
    });

    it('should return the original list if the input is null', () => {
      component.input = null;
      component.list = faker.random.words().split(' ');
      expect(component.getSearchedList()).toEqual(component.list);
    });

    it('should return a filtered list given the input', () => {
      component.list = faker.random.words().split(' ');
      component.input.nativeElement.value = component.list[0];
      const filteredList = component.getSearchedList();
      for (const item of filteredList) {
        expect(item.toLowerCase()).toContain(component.list[0].toLowerCase());
      }
    });
  });

  describe('SearchableSelectionListComponent.onSelect()', () => {
    it('should emit the mat-list selected options', async done => {
      component.list = faker.random.words().split(' ');
      fixture.detectChanges();
      const matList = fixture.debugElement.query(By.directive(MatSelectionList))
        .context;
      component.itemSelected.subscribe(list => {
        expect(list).toEqual(component.list);
        done();
      });
      matList.selectAll();
      component.optionSelected(new MatSelectionListChange(matList, null));
    });
  });

  describe('ignoreCaseStartsWithMatch', () => {
    it('should return true if the first parameter string start with the second parameter', () => {
      const targetString: string = faker.random.word();
      expect(
        SearchableSelectionListComponent.ignoreCaseContainsMatch(
          targetString,
          targetString.substr(0, 1)
        )
      ).toBeTruthy();
    });

    it('should return false if the first parameter string does not start with in the second parameter', () => {
      const targetString: string = faker.random.word();
      expect(
        SearchableSelectionListComponent.ignoreCaseContainsMatch(
          targetString.substr(0, 1),
          targetString
        )
      ).toBeFalsy();
    });

    it('should ignore case', () => {
      const targetString: string = faker.random.word();
      expect(
        SearchableSelectionListComponent.ignoreCaseContainsMatch(
          targetString.toUpperCase(),
          targetString.substr(0, 1).toLowerCase()
        )
      ).toBeTruthy();
    });
  });
});
