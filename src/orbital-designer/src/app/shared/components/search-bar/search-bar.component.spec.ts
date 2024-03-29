import { ComponentFixture, TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent<string>;
  let fixture: ComponentFixture<SearchBarComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<SearchBarComponent<string>>(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SearchBarComponent.onSearchInput', () => {
    it('should remove any items that do not match the criteria', (done) => {
      const unfilteredList: string[] = faker.random.words(10).split(' ');
      component.list = unfilteredList;
      component.filteredList.subscribe((filteredList) => {
        expect(filteredList.findIndex((item) => item === unfilteredList[0])).toBe(-1);
        done();
      });
      component.onSearchInput(`${unfilteredList[0]}sample`);
    });
  });

  describe('SearchBarComponent.ignoreCaseContainsMatch', () => {
    it('Should return true if a substring matches', () => {
      const testString: string = faker.random.word();
      expect(
        SearchBarComponent.ignoreCaseContainsMatch(
          testString,
          testString.substring(0, faker.datatype.number({ min: 1, max: testString.length - 1 }))
        )
      ).toBeTruthy();
    });
  });

  describe('SearchBarComponent.ignoreCaseContainsMatch', () => {
    it('Should return false if no substring is found', () => {
      const testString: string = faker.random.word();
      expect(SearchBarComponent.ignoreCaseContainsMatch(testString, faker.random.word() + testString)).toBeFalsy();
    });
  });
});
