import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemRuleComponent } from './kvp-list-item-rule.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { KvpAddRuleComponent } from '../kvp-add-rule/kvp-add-rule.component';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { KeyValuePair } from 'src/app/models/mock-definition/scenario/key-value-pair.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('KvpListItemRuleComponent', () => {
  let component: KvpListItemRuleComponent;
  let fixture: ComponentFixture<KvpListItemRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, MatCardModule, BrowserAnimationsModule],
      declarations: [
        KvpListItemRuleComponent,
        KvpAddRuleComponent,
        KvpEditRuleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpListItemRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('kvp', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should contain correct key value pair', () => {
      const input: KeyValuePairRule = {
        type: RuleType.TEXTEQUALS,
        rule: {key: faker.lorem.sentence(), value: faker.lorem.sentence()} as KeyValue<string, string>
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });
  });

  describe('onRemove', () => {
    it('Should emit a remove event', () => {
      const input: KeyValuePairRule = {
        type: RuleType.TEXTEQUALS,
        rule: {key: faker.lorem.sentence(), value: faker.lorem.sentence()} as KeyValue<string, string>
      };

      component.kvp = input;
      component.onRemove();

      component.removeKvp.subscribe(
        actual => expect(actual).toEqual(input),
        err => fail(`Unexpected error: ${err.message}`)
      );
    });
  });
});
