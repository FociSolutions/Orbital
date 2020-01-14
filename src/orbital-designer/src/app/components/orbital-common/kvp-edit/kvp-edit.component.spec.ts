import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpEditComponent } from './kvp-edit.component';
import { OrbitalCommonModule } from '../orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValue } from '@angular/common';
import { KeyValuePair } from 'src/app/models/mock-definition/scenario/key-value-pair.model';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';

describe('KvpEditComponent', () => {
  let component: KvpEditComponent;
  let fixture: ComponentFixture<KvpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        LoggerTestingModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpEditComponent.addKvpToMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a map with the added a case-sensitive kvp', () => {
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: {
          key: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        }
      };
      component.isCaseSensitive = true;
      component.addKvpRuleToMap(kvpToAdd);
      expect(component.savedKvpRules.includes(kvpToAdd)).toBeTruthy();
    });

    it('Should return a map with the added a case-insensitive kvp', () => {
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: {
          key: faker.lorem.sentence().toUpperCase(),
          value: faker.lorem.sentence()
        }
      };
      component.isCaseSensitive = false;
      component.addKvpRuleToMap(kvpToAdd);
      expect(
        component.savedKvpRules.find(
          element => kvpToAdd.rule.key.toLowerCase() === element.rule.key
        )
      ).toBeTruthy();
    });

    it('Should not add kvp to map if kvp is empty/null', () => {
      component.savedKvpRules = [];
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: null
      };

      component.addKvpRuleToMap(kvpToAdd);
      expect(
        component.savedKvpRules.find(element => element.rule === null)
      ).toBeFalsy();
    });
  });

  describe('KvpEditComponent.deleteKvpFromMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a map without the deleted kvp', () => {
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: {
          key: faker.lorem.sentence().toUpperCase(),
          value: faker.lorem.sentence()
        }
      };

      component.addKvpRuleToMap(kvpToAdd);
      component.deleteKvpRuleFromMap(kvpToAdd);

      expect(
        component.savedKvpRules.find(
          element => kvpToAdd.rule.key === element.rule.key
        )
      ).toBeFalsy();
    });

    it('Should not be able to delete kvp if map if kvp is empty/null', () => {
      component.savedKvpRules = [];
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: null
      };

      component.addKvpRuleToMap(kvpToAdd);
      component.deleteKvpRuleFromMap(kvpToAdd);
      expect(
        component.savedKvpRules.find(element => kvpToAdd.rule === element.rule)
      ).toBeFalsy();
    });
  });

  describe('KvpEditComponent.kvpMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should set kvpMap a map with the new kvpmap values', () => {
      const newKvpRuleMap = [];
      newKvpRuleMap.push(faker.lorem.sentence(), faker.lorem.sentence());
      component.kvpMap = newKvpRuleMap;
      expect(component.savedKvpRules).toEqual(newKvpRuleMap);
    });
  });

  describe('KvpEditComponent.Save', () => {
    it('Should emit the savedkvp map is Save is set to true', () => {
      const newKvpMap: Map<string, string> = new Map<string, string>();
      newKvpMap.set(faker.lorem.sentence(), faker.lorem.sentence());
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = true;

      expect(component.savedKvpMapEmitter.emit).toHaveBeenCalledWith(
        component.savedKvpRules
      );
    });

    it('Should not emit the savedkvp map is Save is set to false', () => {
      const newKvpMap: Map<string, string> = new Map<string, string>();
      newKvpMap.set(faker.lorem.sentence(), faker.lorem.sentence());
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = false;

      expect(component.savedKvpMapEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
