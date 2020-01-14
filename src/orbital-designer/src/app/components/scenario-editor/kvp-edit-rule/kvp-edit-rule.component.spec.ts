import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpEditRuleComponent } from './kvp-edit-rule.component';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValue } from '@angular/common';
import { KvpListItemRuleComponent } from './kvp-list-item-rule/kvp-list-item-rule.component';
import { KvpAddRuleComponent } from './kvp-add-rule/kvp-add-rule.component';
import { MatCardModule } from '@angular/material';

describe('KvpEditRuleComponent', () => {
  let component: KvpEditRuleComponent;
  let fixture: ComponentFixture<KvpEditRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        LoggerTestingModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [
        KvpListItemRuleComponent,
        KvpAddRuleComponent,
        KvpEditRuleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpEditRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpEditRuleComponent.addKvpToMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a map with the added a case-sensitive kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };
      component.isCaseSensitive = true;
      component.addKvpToMap(kvpToAdd);
      expect(component.savedKvpMap.get(kvpToAdd.key)).toEqual(kvpToAdd.value);
    });

    it('Should return a map with the added a case-insensitive kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence().toUpperCase(),
        value: faker.lorem.sentence().toUpperCase()
      };
      component.isCaseSensitive = false;
      component.addKvpToMap(kvpToAdd);
      expect(component.savedKvpMap.get(kvpToAdd.key.toLowerCase())).toEqual(kvpToAdd.value);
    });

    it('Should not add kvp to map if kvp is empty/null', () => {
      component.savedKvpMap = new Map<string, string>();
      const kvpToAdd: KeyValue<string, string> = {
        key: null,
        value: ''
      };

      component.addKvpToMap(kvpToAdd);
      expect(component.savedKvpMap.has(kvpToAdd.key)).toBeFalsy();
    });
  });

  describe('KvpEditRuleComponent.deleteKvpFromMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a map without the deleted kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };

      component.addKvpToMap(kvpToAdd);
      component.deleteKvpFromMap(kvpToAdd);
      expect(component.savedKvpMap.has(kvpToAdd.key)).toBe(false);
    });

    it('Should not be able to delete kvp if map if kvp is empty/null', () => {
      component.savedKvpMap = new Map<string, string>();
      const kvpToAdd: KeyValue<string, string> = {
        key: null,
        value: ''
      };

      component.addKvpToMap(kvpToAdd);
      component.deleteKvpFromMap(kvpToAdd);
      expect(component.savedKvpMap.has(kvpToAdd.key)).toBe(false);
    });
  });

  describe('KvpEditRuleComponent.kvpMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should set kvpMap a map with the new kvpmap values', () => {
      const newKvpMap: Map<string, string> = new Map<string, string>();
      newKvpMap.set(faker.lorem.sentence(), faker.lorem.sentence());
      component.kvpMap = newKvpMap;
      expect(component.savedKvpMap).toEqual(newKvpMap);
    });
  });

  describe('KvpEditRuleComponent.Save', () => {
    it('Should emit the savedkvp map is Save is set to true', () => {
      const newKvpMap: Map<string, string> = new Map<string, string>();
      newKvpMap.set(faker.lorem.sentence(), faker.lorem.sentence());
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = true;

      expect(component.savedKvpMapEmitter.emit).toHaveBeenCalledWith(
        component.savedKvpMap
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
