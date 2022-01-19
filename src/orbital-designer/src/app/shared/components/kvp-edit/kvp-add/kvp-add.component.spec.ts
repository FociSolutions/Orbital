import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddComponent } from './kvp-add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { SharedModule } from 'src/app/shared/shared.module';

describe('KvpAddComponent', () => {
  let component: KvpAddComponent;
  let fixture: ComponentFixture<KvpAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule, LoggerTestingModule],
    }).compileComponents();
  });

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
    it('Should set key and value to kvpAdd and isValid to true', (done) => {
      const input = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence(),
      };
      component.key = input.key;
      component.value = input.value;

      component.kvp.subscribe((actual) => {
        expect(component.isValid).toBeTruthy();
        expect(actual.key).toEqual(input.key);
        expect(actual.value).toEqual(input.value);
        done();
      });

      component.onAdd();
    });

    it('Should set isValid to false if isEmpty is true', async () => {
      component.key = '';
      component.value = '';
      component.onAdd();
      fixture.whenStable().then(() => {
        expect(component.isValid).toBeFalsy();
      });
    });
  });
});
