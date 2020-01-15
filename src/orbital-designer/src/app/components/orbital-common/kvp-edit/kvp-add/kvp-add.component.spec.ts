import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddComponent } from './kvp-add.component';
import { OrbitalCommonModule } from '../../orbital-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { KeyValue } from '@angular/common';
import { KeyValuePair } from 'src/app/models/mock-definition/scenario/key-value-pair.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';

describe('KvpAddComponent', () => {
  let component: KvpAddComponent;
  let fixture: ComponentFixture<KvpAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpAddComponent.isEmpty', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('Should return true if the key is empty', () => {
      component.key = '';
      component.value = faker.lorem.sentence();
      expect(component.isEmpty()).toBe(true);
    });

    it('Should return true if the value is empty', () => {
      component.value = '';
      component.key = faker.lorem.sentence();
      expect(component.isEmpty()).toBe(true);
    });

    it('Should return false if both value and key are not empty', () => {
      component.value = faker.lorem.sentence();
      component.key = faker.lorem.sentence();
      expect(component.isEmpty()).toBe(false);
    });

    it('Should return false if key is whitespace and value is non-empty', () => {
      component.value = faker.lorem.sentence();
      component.key = ' ';
      expect(component.isEmpty()).toBe(true);
    });
  });

  describe('KvpAddComponent.onAdd', () => {
    it('Should set key and value to kvpAdd and isValid to true', done => {
      let kvp = {} as KeyValueIndexSig;
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();

      const input = {
        rule: kvp
      } as KeyValuePair;

      component.key = KeyValueIndexSig.getKey(input.rule);
      component.value = KeyValueIndexSig.getValue(input.rule);

      component.kvp.subscribe(
        actual => {
          expect(component.isValid).toBeTruthy();
          expect(KeyValueIndexSig.getKey(actual.rule)).toEqual(component.key);
          expect(KeyValueIndexSig.getValue(actual.rule)).toEqual(
            component.value
          );
          done();
        },
        err => {
          return fail(`Unexpected error: ${err.message}`);
        }
      );

      component.onAdd();
    });

    it('Should set isValid to false if isEmpty is true', () => {
      component.key = '';
      component.value = '';
      component.onAdd();
      expect(component.isValid).toBeFalsy();
    });
  });
});
