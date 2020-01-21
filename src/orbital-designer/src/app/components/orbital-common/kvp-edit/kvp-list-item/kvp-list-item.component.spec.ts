import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemComponent } from './kvp-list-item.component';
import { OrbitalCommonModule } from '../../orbital-common.module';
import { KeyValue } from '@angular/common';

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
      const input: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });
  });

  describe('onRemove', () => {
    it('Should emit a remove event', () => {
      const input: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
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
