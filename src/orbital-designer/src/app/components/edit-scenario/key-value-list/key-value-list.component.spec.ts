import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KeyValueListComponent } from './key-value-list.component';

describe('KeyValueListComponent', () => {
  let component: KeyValueListComponent;
  let fixture: ComponentFixture<KeyValueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValueListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueListComponent);
    component = fixture.componentInstance;
    component.keyValueMap = new Map<string, string>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add tuple to the map', () => {
    expect(component.keyValueMap.size).toBe(0);
    const key = faker.random.word();
    const item = faker.random.word();
    component.key = key;
    component.val = item;
    component.addTuple(new Event('click'));
    expect(component.keyValueMap.size).toBe(1);
    expect(component.keyValueMap.get(key)).toMatch(item);
  });

  it('should change the key of a tuple', () => {
    const key = faker.random.word();
    const oldKey = faker.random.word();
    const item = faker.random.word();
    component.key = oldKey;
    component.val = item;
    component.addTuple(new Event('click'));
    component.changeKey(oldKey, key);
    expect(component.keyValueMap.has(key)).toBeTruthy();
  });
});
