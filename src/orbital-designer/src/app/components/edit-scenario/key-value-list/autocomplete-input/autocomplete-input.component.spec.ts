import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { MatAutocompleteModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';

describe('AutocompleteInputComponent', () => {
  let component: AutocompleteInputComponent;
  let fixture: ComponentFixture<AutocompleteInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteInputComponent ],
      imports: [MatAutocompleteModule, BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('given a key that does not exist in the components key list', () => {
    it('should return a list with the given key inside the list.', () => {
      const  headerKeysList = ['Authorization', 'Content-Transfer-Encoding', 'Date', 'ETag', 'Expires', 'Host', 'If-Match'];
      component.keys = headerKeysList;

      headerKeysList.forEach(key => {
        const results = component.searchFromArray(key);
        expect(results.length).toBeGreaterThan(0);
        expect(results.every(result => result === key)).toBeTruthy();
      });
    });
  });
  describe('given an UpperCase key that exists in the components key list', () => {
    it('should return a list with the given key inside the list.', () => {
      const  headerKeysList = ['Authorization', 'Content-Transfer-Encoding', 'Date', 'ETag', 'Expires', 'Host', 'If-Match'];
      component.keys = headerKeysList;

      headerKeysList.forEach(key => {
        const results = component.searchFromArray(key.toLocaleUpperCase());
        expect(results.length).toBeGreaterThan(0);
        expect(results.every(result => result === key)).toBeTruthy();
      });
    });
  });
  describe('given a LowerCase key that exists in the components key list', () => {
    it('should return a list with the given key inside the list.', () => {
      const  headerKeysList = ['Authorization', 'Content-Transfer-Encoding', 'Date', 'ETag', 'Expires', 'Host', 'If-Match'];
      component.keys = headerKeysList;

      headerKeysList.forEach(key => {
        const results = component.searchFromArray(key.toLocaleLowerCase());
        expect(results.length).toBeGreaterThan(0);
        expect(results.every(result => result === key)).toBeTruthy();
      });
    });
  });
  describe('given a key that no exists in the components key list', () => {
    it('should return a different value.', () => {
      const  nonHeaderKeyList = ['a', 'e', 'Non-Key'];
      component.keys = nonHeaderKeyList;

      nonHeaderKeyList.forEach(key => {
        const results = component.searchFromArray(key.toLocaleLowerCase());
        expect(results.length).toBeGreaterThan(0);
        expect(results.every(result => result !== key)).not.toBeTruthy();
      });
    });
  });
  describe('given an empty key', () => {
    it('should return an empty array.', () => {
      const  headerKeysList = [];
      component.keys = headerKeysList;

      headerKeysList.forEach(key => {
        const results = component.searchFromArray(key);
        expect(results.every(result => result === key)).toBeTruthy();
      });
    });
  });
});
