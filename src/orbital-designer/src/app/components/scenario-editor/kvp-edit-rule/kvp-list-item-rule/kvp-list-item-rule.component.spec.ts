import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemRuleComponent } from './kvp-list-item-rule.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { MatCardModule } from '@angular/material';
import { KvpAddRuleComponent } from '../kvp-add-rule/kvp-add-rule.component';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';

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
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairType = {
        type: RuleType.TEXTEQUALS,
        rule: kvp as KeyValueIndexSig
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });
  });

  describe('onRemove', () => {
    it('Should emit a remove event', () => {
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairType = {
        type: RuleType.TEXTEQUALS,
        rule: kvp as KeyValueIndexSig
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
