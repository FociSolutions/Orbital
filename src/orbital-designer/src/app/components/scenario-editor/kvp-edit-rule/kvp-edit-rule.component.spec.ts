import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { KvpEditRuleComponent } from './kvp-edit-rule.component';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { MatCardModule } from '@angular/material';
import { RuleType } from '../../../../../src/app/models/mock-definition/scenario/rule.type';
import { KeyValueIndexSig } from '../../../../../src/app/models/mock-definition/scenario/key-value-index-sig.model';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
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
      declarations: [KvpListItemRuleTypeComponent, KvpEditRuleComponent]
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

  describe('KvpEditRuleComponent.deleteKvpFromRule', () => {
    it('should not delete the kvp if it is undefined', () => {
      const kvp = {test: 'testval'};
      const kvpMap = [{type: RuleType.TEXTEQUALS as RuleType, rule: kvp as KeyValueIndexSig}] as KeyValuePairType[];
      component.savedKvpMap = kvpMap;
      component.deleteKvpFromRule(undefined);
      expect(component.savedKvpMap.length).toBe(1);
    });

    it('should not delete the kvp if the rule is undefined', () => {
      const kvpMap = [{type: RuleType.TEXTEQUALS as RuleType, rule: undefined}] as KeyValuePairType[];
      component.savedKvpMap = kvpMap;
      component.deleteKvpFromRule(undefined);
      expect(component.savedKvpMap.length).toBe(1);
    });

    it('should delete the kvp if it defined', () => {
      const kvp = {test: 'testval'};
      const kvpMap = [{type: RuleType.TEXTEQUALS as RuleType, rule: kvp as KeyValueIndexSig}] as KeyValuePairType[];
      component.savedKvpMap = kvpMap;
      component.deleteKvpFromRule(kvpMap[0]);
      expect(component.savedKvpMap.length).toBe(0);
    });

    it('should delete the kvp by key if there are multiple similar kvps', () => {
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const kvpMap = [
        {type: RuleType.TEXTEQUALS as RuleType, rule: {test: 'testval'} as KeyValueIndexSig},
        {type: RuleType.TEXTCONTAINS as RuleType, rule: {testtwo: 'testval'} as KeyValueIndexSig},
        {type: RuleType.TEXTEQUALS as RuleType, rule: {testthree: 'testval'} as KeyValueIndexSig}] as KeyValuePairType[];
      component.savedKvpMap = kvpMap;
      component.deleteKvpFromRule(kvpMap[0]);
      expect(component.savedKvpMap.length).toBe(2);
    });
  });

  describe('KvpEditRuleComponent.kvpMap setter', () => {
    it('should not set the kvpMap if it is undefined', () => {
      const kvp = {test: 'testval'};
      const kvpMap = [{type: RuleType.TEXTEQUALS as RuleType, rule: kvp as KeyValueIndexSig}] as KeyValuePairType[];
      component.kvpMap = kvpMap;
      component.kvpMap = undefined;
      expect(component.savedKvpMap).toEqual(kvpMap);
    });

    it('should set the kvpMap if it is defined', () => {
      const kvp = {test: 'testval'};
      const kvpMap = [{type: RuleType.TEXTEQUALS as RuleType, rule: kvp as KeyValueIndexSig}] as KeyValuePairType[];
      component.kvpMap = kvpMap;
      expect(component.savedKvpMap).toEqual(kvpMap);
    });
  });

  describe('KvpEditRuleComponent.Save savedKvpMapEmitter', () => {
    it('should not emit the savedKvpMap if it should not save', () => {
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = false;
      expect(component.savedKvpMapEmitter.emit).not.toHaveBeenCalled();
    });

    it('should emit the savedKvpMap if it should save', () => {
      const kvp = {test: 'testval'};
      const kvpMap = [{type: RuleType.TEXTEQUALS as RuleType, rule: kvp as KeyValueIndexSig}] as KeyValuePairType[];
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpMapEmitter.emit).toHaveBeenCalledWith(kvpMap);
    });

    it('should emit the savedKvpMap if it should save and the kvp map is empty', () => {
      const kvpMap = [{}] as KeyValuePairType[];
      component.savedKvpMap = kvpMap;
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpMapEmitter.emit).toHaveBeenCalledWith(kvpMap);
    });

    it('should emit an empty savedKvpMap when the component is initialized', () => {
      const kvpMap = [{}] as KeyValuePairType[];
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpMapEmitter.emit).toHaveBeenCalledWith(kvpMap);
    });

    it('should emit the savedKvpMap if it should save and the kvp map contains multiple items', () => {
      const kvpMap = [
        {type: RuleType.TEXTEQUALS as RuleType, rule: {test: 'testval'} as KeyValueIndexSig},
        {type: RuleType.TEXTCONTAINS as RuleType, rule: {testtwo: 'testval'} as KeyValueIndexSig},
        {type: RuleType.TEXTEQUALS as RuleType, rule: {testthree: 'testval'} as KeyValueIndexSig}] as KeyValuePairType[];
      spyOn(component.savedKvpMapEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpMapEmitter.emit).toHaveBeenCalledWith(kvpMap);
    });
  });
});
