import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShuttleListComponent } from './shuttle-list.component';
import { ShuttleSubListComponent } from './shuttle-sub-list/shuttle-sub-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import testMockDefinitionObject from '../../../../test-files/test-mockdefinition-object';

describe('ShuttleListComponent', () => {
  let component: ShuttleListComponent;
  let fixture: ComponentFixture<ShuttleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShuttleListComponent, ShuttleSubListComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule,
        LoggerTestingModule
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
      const expectedList: MockDefinition = testMockDefinitionObject;
      component.onSelectLeft([expectedList]);
      expect(component.leftSelected).toEqual([expectedList]);
    });
  });

  describe('ShuttleListComponent.onSelectRight()', () => {
    it('should set the rightSelected list to the list passed into it when the second parameter is false', () => {
      const expectedList = faker.random.words().split(' ') as unknown as MockDefinition[];
      component.onSelectRight(expectedList);
      expect(component.rightSelected).toEqual(expectedList);
    });
  });

  describe('ShuttleListComponent.list', () => {
    it('if the list is not null, should set the leftList to the incoming list and the rightList to an empty list', () => {
      const expectedList = [testMockDefinitionObject];
      component.list = [...expectedList];
      expect(component.leftList).toEqual(expectedList);
      expect(component.rightList).toEqual([]);
    });

  });

  describe('ShuttleListComponent.onMoveLeft()', () => {
    it('should move the items in rightSelected to the leftList when the first parameter is false', () => {
      const expectedList = [testMockDefinitionObject];
      component.rightSelected = [...expectedList];
      component.onMoveLeft();
      expect(component.leftList).toEqual(expectedList);
    });

    it('should append to the leftList and not overwrite', () => {
      const expectedList = [testMockDefinitionObject,
        testMockDefinitionObject,
        testMockDefinitionObject,
        testMockDefinitionObject];

      const fakedList = [testMockDefinitionObject];
      component.leftList = expectedList;
      component.rightSelected = [...fakedList];
      component.onMoveLeft();
      for (const item of fakedList) {
        expect(component.leftList).toContain(item);
      }
      expect(component.leftList).toContain(expectedList[0]);
    });

    it('should clear the rightSelected', () => {
      component.leftSelected = [testMockDefinitionObject];
      component.onMoveLeft();
      expect(component.rightSelected).toEqual([]);
    });
  });

  describe('ShuttleListComponent.onMoveRight()', () => {
    it('should move the items in leftSelected to the rightList when the first parameter is true or empty', () => {
      const expectedList = [testMockDefinitionObject,
        testMockDefinitionObject,
        testMockDefinitionObject];
      component.leftSelected = [...expectedList];
      component.onMoveRight();
      expect(component.rightList).toEqual(expectedList);
    });

    it('should append to the rightList and not overwrite', () => {
      const fakedList = [testMockDefinitionObject,
        testMockDefinitionObject,
        testMockDefinitionObject];
      const originalListItem = fakedList[0];
      component.rightList = [originalListItem];
      component.leftSelected = [...fakedList];
      component.onMoveRight();
      for (const item of fakedList) {
        expect(component.rightList).toContain(item);
      }
      expect(component.rightList).toContain(originalListItem);
    });

    it('should clear the leftSelected', () => {
      component.leftSelected = [testMockDefinitionObject,
        testMockDefinitionObject,
        testMockDefinitionObject];
      component.onMoveRight();
      expect(component.leftSelected).toEqual([]);
    });
  });
});
