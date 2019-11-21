import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShuttleListComponent } from './shuttle-list.component';
import { SearchableSelectionListComponent } from '../searchable-selection-list/searchable-selection-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import * as faker from 'faker';

describe('ShuttleListComponent', () => {
  let component: ShuttleListComponent;
  let fixture: ComponentFixture<ShuttleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShuttleListComponent, SearchableSelectionListComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ShuttleListComponent.onSelectLeft()', () => {
    it('should set the leftSelected list to the list passed into it when the second parameter is true', () => {
      const expectedList = faker.random.words().split(' ');
      component.onSelectLeft(expectedList);
      expect(component.leftSelected).toEqual(expectedList);
    });
  });

  describe('ShuttleListComponent.onSelectRight()', () => {
    it('should set the rightSelected list to the list passed into it when the second parameter is false', () => {
      const expectedList = faker.random.words().split(' ');
      component.onSelectRight(expectedList);
      expect(component.rightSelected).toEqual(expectedList);
    });
  });

  describe('ShuttleListComponent.list', () => {
    it('if the list is not null, should set the leftList to the incoming list and the rightList to an empty list', () => {
      const expectedList = faker.random.words().split(' ');
      component.list = [...expectedList];
      expect(component.leftList).toEqual(expectedList);
      expect(component.rightList).toEqual([]);
    });

    it('if the list is null, should not set the leftList and not change the rightList', () => {
      const fakedList = faker.random.words().split(' ');
      component.rightList = [...fakedList];
      component.list = null;
      expect(component.leftList).not.toBeNull();
      expect(component.rightList).toEqual(fakedList);
    });
  });

  describe('ShuttleListComponent.onMoveLeft()', () => {
    it('should move the items in rightSelected to the leftList when the first parameter is false', () => {
      const expectedList = faker.random.words().split(' ');
      component.rightSelected = [...expectedList];
      component.onMoveLeft();
      expect(component.leftList).toEqual(expectedList);
    });

    it('should append to the leftList and not overwrite', () => {
      const fakedList = faker.random.words().split(' ');
      const originalListItem = fakedList[0].substring(
        0,
        fakedList[0].length / 2
      );
      component.leftList = [originalListItem];
      component.rightSelected = [...fakedList];
      component.onMoveLeft();
      for (const item of fakedList) {
        expect(component.leftList).toContain(item);
      }
      expect(component.leftList).toContain(originalListItem);
    });

    it('should clear the rightSelected', () => {
      component.leftSelected = faker.random.words().split(' ');
      component.onMoveLeft();
      expect(component.rightSelected).toEqual([]);
    });
  });

  describe('ShuttleListComponent.onMoveRight()', () => {
    it('should move the items in leftSelected to the rightList when the first parameter is true or empty', () => {
      const expectedList = faker.random.words().split(' ');
      component.leftSelected = [...expectedList];
      component.onMoveRight();
      expect(component.rightList).toEqual(expectedList);
    });

    it('should append to the rightList and not overwrite', () => {
      const fakedList = faker.random.words().split(' ');
      const originalListItem = fakedList[0].substring(
        0,
        fakedList[0].length / 2
      );
      component.rightList = [originalListItem];
      component.leftSelected = [...fakedList];
      component.onMoveRight();
      for (const item of fakedList) {
        expect(component.rightList).toContain(item);
      }
      expect(component.rightList).toContain(originalListItem);
    });

    it('should clear the leftSelected', () => {
      component.leftSelected = faker.random.words().split(' ');
      component.onMoveRight();
      expect(component.leftSelected).toEqual([]);
    });
  });
});
