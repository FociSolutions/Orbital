import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { KvpEditRuleComponent } from './kvp-edit-rule.component';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { MatCardModule } from '@angular/material';
import { RuleType } from '../../../../../src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import * as faker from 'faker';
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
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() }
        }
      ] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      component.deleteKvpFromRule(undefined);
      expect(component.savedKvpType.length).toBe(1);
    });

    it('should not delete the kvp if the rule is undefined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType
        }
      ] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      component.deleteKvpFromRule(undefined);
      expect(component.savedKvpType.length).toBe(1);
    });

    it('should delete the kvp if it defined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() } as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      component.deleteKvpFromRule(kvpType[0]);
      expect(component.savedKvpType.length).toBe(0);
    });

    it('should delete the kvp by key if there are multiple similar kvps', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: randomWord } as Record<string, string>
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { testtwo: randomWord } as Record<string, string>
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { testthree: randomWord } as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      component.deleteKvpFromRule(kvpType[0]);
      expect(component.savedKvpType.length).toBe(2);
    });
  });

  describe('KvpEditRuleComponent.kvpType setter', () => {
    it('should not set the kvpType if it is undefined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() } as Record<string, string>
        }
      ] as KeyValuePairRule[];

      // it is ok to set it twice (normally this is redundant) as it is checking if the setter
      // does not set if it is previously defined
      component.kvpType = kvpType;
      component.kvpType = undefined;
      expect(component.savedKvpType).toEqual(kvpType);
    });

    it('should set the kvpType if it is defined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() } as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.kvpType = kvpType;
      expect(component.savedKvpType).toEqual(kvpType);
    });
  });

  describe('KvpEditRuleComponent.Save savedKvpEmitter', () => {
    it('should not emit the savedKvp if it should not save', () => {
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = false;
      expect(component.savedKvpEmitter.emit).not.toHaveBeenCalled();
    });

    it('should emit the savedKvp if it should save', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: {} as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpEmitter.emit).toHaveBeenCalledWith(kvpType);
    });

    it('should emit the savedKvp if it should save and the kvp is empty', () => {
      const kvpType = [] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpEmitter.emit).toHaveBeenCalledWith(kvpType);
    });

    it('should emit an empty savedKvp when the component is initialized', () => {
      const kvpType = [] as KeyValuePairRule[];
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpEmitter.emit).toHaveBeenCalledWith(kvpType);
    });

    it('should emit the savedKvp if it should save and the kvp contains multiple items', () => {
      const randomValue = faker.random.word();
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: randomValue } as Record<string, string>
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { testtwo: randomValue } as Record<string, string>
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { testthree: randomValue } as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.savedKvpType = kvpType;
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = true;
      expect(component.savedKvpEmitter.emit).toHaveBeenCalledWith(kvpType);
    });
  });

  describe('KvpEditRuleComponent.addKvp', () => {
    it('should save valid key value pair', () => {
      const kvp = {
        type: faker.random.number({
          min: 0,
          max: Object.keys(RuleType).length - 1
        }) as RuleType,
        rule: {
          [faker.random.word()]: faker.random.word()
        } as Record<string, string>
      } as KeyValuePairRule;
      component.addKvp(kvp);
      expect(component.savedKvpType.length).toBe(1);
      expect(component.savedKvpType[0]).toEqual(kvp);
    });
  });

  it('should not save repeated key value pair', () => {
    const kvp = {
      type: faker.random.number({
        min: 0,
        max: Object.keys(RuleType).length - 1
      }) as RuleType,
      rule: {
        [faker.random.word()]: faker.random.word()
      } as Record<string, string>
    } as KeyValuePairRule;
    component.addKvp(kvp);
    component.addKvp(kvp);
    expect(component.savedKvpType.length).toBe(1);
    expect(component.savedKvpType[0]).toEqual(kvp);
  });
});
