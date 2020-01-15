import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddRuleComponent } from './kvp-add-rule.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { KvpListItemRuleComponent } from '../kvp-list-item-rule/kvp-list-item-rule.component';
import { MatCardModule } from '@angular/material';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';

describe('KvpAddRuleComponent', () => {
  let component: KvpAddRuleComponent;
  let fixture: ComponentFixture<KvpAddRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatCardModule
      ],
      declarations: [
        KvpListItemRuleComponent,
        KvpAddRuleComponent,
        KvpEditRuleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpAddRuleComponent.isEmpty', () => {
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

  describe('KvpAddRuleComponent.onAdd', () => {
    it('Should set key and value to kvpAdd and isValid to true', () => {
      const input = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };
      component.key = input.key;
      component.value = input.value;

      component.kvp.subscribe(
        actual => {
          expect(component.isValid).toBeTruthy();
          expect(actual).toEqual(input);
        },
        err => fail(`Unexpected error: ${err.message}`)
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
