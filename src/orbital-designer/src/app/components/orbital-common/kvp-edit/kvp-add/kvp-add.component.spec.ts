import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddComponent } from './kvp-add.component';
import { OrbitalCommonModule } from '../../orbital-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';

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

  describe('KvpAddComponent.hasDuplicates', () => {
    beforeEach(() => {
      const testKvpMap: Map<string, string> = new Map<string, string>();
      const randomKey: string = faker.lorem.sentence();
      const randomValue: string = faker.lorem.sentence();

      testKvpMap.set(randomKey, randomValue);
      component.kvpMap = testKvpMap;
      fixture.detectChanges();
    });
    it('Should return true if there are duplicate keys', () => {
      const keys = Array.from(component.kvpMap.keys());
      component.key = faker.random.arrayElement(keys);
      expect(component.hasDuplicates()).toBeTruthy();
    });

    it('Should return false if there are no duplicate keys', () => {
      const keys = Array.from(component.kvpMap.keys());
      component.key = faker.random.arrayElement(keys) + 'Test';
      expect(component.hasDuplicates()).toBeFalsy();
    });
  });

  describe('KvpAddComponent.isEmpty', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('Should return true if the key is empty', () => {
      component.key = '';
      component.key = faker.lorem.sentence();
      expect(component.isEmpty()).toBeTruthy();
    });

    it('Should return true if the value is empty', () => {
      component.value = '';
      component.key = faker.lorem.sentence();
      expect(component.isEmpty()).toBeTruthy();
    });

    it('Should return false if both value and key are not empty', () => {
      component.value = faker.lorem.sentence();
      component.key = faker.lorem.sentence();
      expect(component.isEmpty()).toBeFalsy();
    });
  });

  describe('KvpAddComponent.onAdd', () => {
    beforeEach(() => {
      const randomKey: string = faker.lorem.sentence();
      const randomValue: string = faker.lorem.sentence();

      component.key = randomKey;
      component.value = randomValue;

      fixture.detectChanges();
    });
    it('Should set key and value to kvpAdd and isValid to true', () => {
      spyOn(component, 'isEmpty').and.returnValue(false);
      spyOn(component, 'hasDuplicates').and.returnValue(false);
      component.onAdd();
      expect(component.isValid).toBeTruthy();
      expect(component.kvpAdd.key === component.key).toBeTruthy();
    });

    it('Should set isValid to false if isEmpty is true and hadDuplicates is false', () => {
      spyOn(component, 'isEmpty').and.returnValue(true);
      spyOn(component, 'hasDuplicates').and.returnValue(false);
      component.onAdd();
      expect(component.isValid).toBeFalsy();
    });

    it('Should set isValid to false if isEmpty is false and hadDuplicates is true', () => {
      spyOn(component, 'isEmpty').and.returnValue(false);
      spyOn(component, 'hasDuplicates').and.returnValue(true);
      component.onAdd();
      expect(component.isValid).toBeFalsy();
    });
  });
});
