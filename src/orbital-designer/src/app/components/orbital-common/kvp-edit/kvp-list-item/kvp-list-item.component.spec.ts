import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemComponent } from './kvp-list-item.component';
import { OrbitalCommonModule } from '../../orbital-common.module';
import { KeyValue } from '@angular/common';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';

describe('KvpListItemComponent', () => {
  let component: KvpListItemComponent;
  let fixture: ComponentFixture<KvpListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpListItemComponent);
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
        rule: (faker.lorem.sentence(), faker.lorem.sentence()),
        type: faker.random.number({ min: 0, max: 8 })
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });
  });

  describe('onRemove', () => {
    it('Should emit a remove event', () => {
      const input: KeyValuePairRule = {
        rule: (faker.lorem.sentence(), faker.lorem.sentence()),
        type: faker.random.number({ min: 0, max: 8 })
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
