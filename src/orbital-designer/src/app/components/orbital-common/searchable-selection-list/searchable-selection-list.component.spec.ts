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
      component.optionSelected(new MatSelectionListChange(matList, null));
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
