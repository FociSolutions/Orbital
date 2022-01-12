import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { ShuttleSubListComponent } from './shuttle-sub-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import validMockDefinition from '../../../../../test-files/test-mockdefinition-object';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

describe('ShuttleSubListComponent', () => {
  let component: ShuttleSubListComponent;
  let fixture: ComponentFixture<ShuttleSubListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShuttleSubListComponent],
      imports: [MatIconModule, MatListModule, MatCardModule, MatCheckboxModule, MatDividerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ShuttleSubListComponent);
    component = fixture.componentInstance;
    const mock1 = _.cloneDeep(validMockDefinition);
    const mock2 = _.cloneDeep(validMockDefinition);
    mock1.metadata.title = faker.random.words(3);
    mock2.metadata.title = faker.random.words(3);
    component.list = [mock1, mock2].map((mock) => new FormControl(mock, null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ShuttleSubListComponent.onSelect()', () => {
    describe('ShuttleSubListComponent.checkboxLabel', () => {
      it(`should return the select all string if none of the lists options are selected`, () => {
        expect(component.checkboxLabel).toEqual(ShuttleSubListComponent.selectAllString);
      });
    });

    describe('ShuttleSubListComponent.selectAllChecked', () => {
      it('should return false if none of the options are selected', () => {
        expect(component.selectAllChecked).toBeFalsy();
      });
    });

    describe('ShuttleSubListComponent.hideOption', () => {
      it('should return false if no options have been filtered', () => {
        expect(component.hideOption(component.list[0].value)).toBeFalsy();
      });

      it('should return false if there are filtered options but the option passed is not filtered', () => {
        expect(component.hideOption(null)).toBeFalsy();
      });
    });

    describe('ShuttleSubListComponent.onSearchInput()', () => {
      it('should set the filtered options to only options that include text from the input', () => {
        const mock1 = _.cloneDeep(validMockDefinition);
        const mock2 = _.cloneDeep(validMockDefinition);

        mock2.metadata.title = 'ZZZ';
        component.list = [mock1, mock2].map((mock) => new FormControl(mock, null));
        const filteredString = mock1.metadata.title.substr(0, 1);
        fixture.detectChanges();
        component.onSearchInput(filteredString);
        expect(component.filteredOutOptions.map((option) => option.value.value)).toContain(component.list[1].value);
        expect(component.filteredOutOptions.map((option) => option.value.value)).not.toContain(component.list[0].value);
      });
    });

    describe('ignoreCaseStartsWithMatch', () => {
      it('should return true if the first parameter string start with the second parameter', () => {
        const targetString: string = faker.random.word();
        expect(ShuttleSubListComponent.ignoreCaseContainsMatch(targetString, targetString.substr(0, 1))).toBeTruthy();
      });

      it('should return false if the first parameter string does not start with in the second parameter', () => {
        const targetString: string = faker.random.word();
        expect(ShuttleSubListComponent.ignoreCaseContainsMatch(targetString.substr(0, 1), targetString)).toBeFalsy();
      });

      it('should ignore case', () => {
        const targetString: string = faker.random.word();
        expect(
          ShuttleSubListComponent.ignoreCaseContainsMatch(
            targetString.toUpperCase(),
            targetString.substr(0, 1).toLowerCase()
          )
        ).toBeTruthy();
      });
    });
  });
});
