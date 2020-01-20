import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpEditComponent } from './kvp-edit.component';
import { OrbitalCommonModule } from '../orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';
import { MatCardModule } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { KvpListItemRuleTypeComponent } from '../../scenario-editor/kvp-edit-rule/kvp-list-item-rule-type/kvp-list-item-rule-type.component';

describe('KvpEditComponent', () => {
  let component: KvpEditComponent;
  let fixture: ComponentFixture<KvpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        LoggerTestingModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [KvpListItemRuleTypeComponent]
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

  describe('KvpEditComponent.addKvp', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a list of KeyValuePairTypes with the added a case-sensitive kvp', () => {
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: {
          key: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        }
      };
      component.isCaseSensitive = true;
      component.addKvpRule(kvpToAdd);
      expect(component.savedKvpRules.includes(kvpToAdd)).toBeTruthy();
    });

    it('Should return a list of KeyValuePairTypes with the added a case-insensitive kvp', () => {
      const kvp = {} as KeyValueIndexSig;
      kvp[faker.lorem.sentence().toUpperCase()] = faker.lorem.sentence();
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: kvp
      };
      component.isCaseSensitive = false;
      component.addKvpRule(kvpToAdd);
      expect(
        component.savedKvpRules.find(
          element =>
            KeyValueIndexSig.getKey(kvpToAdd.rule).toLowerCase() ===
            KeyValueIndexSig.getKey(element.rule)
        )
      ).toBeTruthy();
    });

    it('Should not add kvp to the kvps if kvp is empty/null', () => {
      component.savedKvpRules = [];
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: null
      };

      component.addKvpRule(kvpToAdd);
      expect(
        component.savedKvpRules.find(element => element.rule === null)
      ).toBeFalsy();
    });
  });

  describe('KvpEditComponent.deleteKvp', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return the kvps without the deleted kvp', () => {
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: {
          key: faker.lorem.sentence().toUpperCase(),
          value: faker.lorem.sentence()
        }
      };

      component.addKvpRule(kvpToAdd);
      component.deleteKvpRule(kvpToAdd);

      expect(
        component.savedKvpRules.find(
          element => kvpToAdd.rule.key === element.rule.key
        )
      ).toBeFalsy();
    });

    it('Should not be able to delete kvp from kvps if kvp is empty/null', () => {
      component.savedKvpRules = [];
      const kvpToAdd: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: 8 }),
        rule: null
      };

      component.addKvpRule(kvpToAdd);
      component.deleteKvpRule(kvpToAdd);
      expect(
        component.savedKvpRules.find(element => kvpToAdd.rule === element.rule)
      ).toBeFalsy();
    });
  });

  describe('KvpEditComponent.kvp', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should set newKvpRule list with new values', () => {
      const newKvpRule = [];
      newKvpRule.push(faker.lorem.sentence(), faker.lorem.sentence());
      component.kvpRule = newKvpRule;
      expect(component.savedKvpRules).toEqual(newKvpRule);
    });
  });

  describe('KvpEditComponent.Save', () => {
    it('Should emit the kvp is Save is set to true', () => {
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = true;

      expect(component.savedKvpEmitter.emit).toHaveBeenCalledWith(
        component.savedKvpRules
      );
    });

    it('Should not emit the kvp is Save is set to false', () => {
      spyOn(component.savedKvpEmitter, 'emit');
      component.Save = false;

      expect(component.savedKvpEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
