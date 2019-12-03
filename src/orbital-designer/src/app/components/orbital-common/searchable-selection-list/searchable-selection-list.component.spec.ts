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
import {
  MatCheckboxModule,
  MatCheckboxChange
} from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

describe('SearchableSelectionListComponent', () => {
  let component: SearchableSelectionListComponent;
  let fixture: ComponentFixture<SearchableSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableSelectionListComponent],
      imports: [
        MatIconModule,
        MatListModule,
        MatCardModule,
        MatCheckboxModule,
        MatDividerModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableSelectionListComponent);
    component = fixture.componentInstance;
    component.list = faker.random.words().split(' ');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SearchableSelectionListComponent.onSelect()', () => {
    it('should emit the mat-list selected options', async done => {
      const matList: MatSelectionList = getMatList(fixture);
      component.itemSelected.subscribe(list => {
        expect(list).toEqual(component.list);
        done();
      });
      matList.selectAll();
      component.optionSelected();
    });
  });

  describe('SearchableSelectionListComponent.checkboxLabel', () => {
    it(`should return the select all string if none of the lists options are selected`, () => {
      expect(component.checkboxLabel).toEqual(
        SearchableSelectionListComponent.selectAllString
      );
    });

    it(`should return the deselect all string if any of the lists options are selected`, () => {
      const matList: MatSelectionList = getMatList(fixture);
      matList.options.first.toggle();
      expect(component.checkboxLabel).toEqual(
        SearchableSelectionListComponent.deselectAllString
      );
    });
  });

  describe('SearchableSelectionListComponent.selectAllChecked', () => {
    it('should return true if any of the options are selected', () => {
      const matList: MatSelectionList = getMatList(fixture);
      matList.options.first.toggle();
      expect(component.selectAllChecked).toBeTruthy();
    });

    it('should return false if none of the options are selected', () => {
      expect(component.selectAllChecked).toBeFalsy();
    });
  });

  describe('SearchableSelectionListComponent.onSelectAll', () => {
    it('should select all the options if the checkbox is being checked', () => {
      const matList: MatSelectionList = getMatList(fixture);
      const event = new MatCheckboxChange();
      event.checked = true;
      component.onSelectAll(event);
      fixture.detectChanges();
      expect(matList.selectedOptions.selected).toEqual(
        matList.options.toArray()
      );
    });

    it('should deselect all the options if the checkbox is being checked', () => {
      const matList: MatSelectionList = getMatList(fixture);
      matList.selectAll();
      const event = new MatCheckboxChange();
      event.checked = false;
      component.onSelectAll(event);
      expect(matList.selectedOptions.selected).not.toEqual(
        matList.options.toArray()
      );
    });

    it('should only select options that pass the filtering', () => {
      const matList: MatSelectionList = getMatList(fixture);
      // Append a string to the list of items that will be filtered out
      const originalString = component.list[0] as string;
      const newString = originalString.substring(0, originalString.length / 2);
      component.list = [...component.list, newString];
      fixture.detectChanges();

      const event = new MatCheckboxChange();
      event.checked = true;

      // Apply filter & select all
      component.onSearchInput(originalString);
      component.onSelectAll(event);

      expect(
        matList.selectedOptions.selected.map(option => option.value)
      ).not.toContain(newString);
    });

    it('should only deselect options that pass the filtering', () => {
      const matList: MatSelectionList = getMatList(fixture);
      // Append a string to the list of items that will be filtered out
      const originalString = component.list[0] as string;
      const newString = originalString.substring(0, originalString.length / 2);
      component.list = [...component.list, newString];
      fixture.detectChanges();

      // Select all options to start
      const event = new MatCheckboxChange();
      event.checked = true;
      component.onSelectAll(event);
      // Check that everything has been selected
      expect(
        matList.selectedOptions.selected.map(option => option.value)
      ).toEqual(component.list);

      // Apply filter & deselect all
      component.onSearchInput(originalString);
      event.checked = false;
      component.onSelectAll(event);

      expect(
        matList.selectedOptions.selected.map(option => option.value)
      ).toContain(newString);
    });
  });

  describe('SearchableSelectionListComponent.hideOption', () => {
    it('should return false if no options have been filtered', () => {
      expect(component.hideOption(component.list[0])).toBeFalsy();
    });

    it('should return false if there are filtered options but the option passed is not filtered', () => {
      expect(component.hideOption(`${component.list[0]}-diff`)).toBeFalsy();
    });

    it('should return true if the option passed has been filtered out', () => {
      const matList: MatSelectionList = getMatList(fixture);
      component.filteredOutOptions = [matList.options.first];
      expect(component.hideOption(component.list[0])).toBeTruthy();
    });
  });

  describe('SearchableSelectionListComponent.onSearchInput()', () => {
    it('should set the filtered options to only options that include text from the input', () => {
      const filteredString = `${component.list[0]}`.substr(0, 1);
      component.list = [...component.list, filteredString];
      fixture.detectChanges();
      component.onSearchInput(component.list[0]);
      expect(
        component.filteredOutOptions.map(option => option.value)
      ).toContain(filteredString);
      expect(
        component.filteredOutOptions.map(option => option.value)
      ).not.toContain(component.list[0]);
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

function getMatList(
  fixture: ComponentFixture<SearchableSelectionListComponent>
): MatSelectionList {
  return fixture.debugElement.query(By.directive(MatSelectionList)).context;
}
