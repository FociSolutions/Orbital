import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpEditComponent } from './kvp-edit.component';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValue } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material.module';

describe('KvpEditComponent', () => {
  let component: KvpEditComponent;
  let fixture: ComponentFixture<KvpEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MaterialModule, LoggerTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

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

    it('Should return a kvp with the added a case-sensitive kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence(),
      };
      component.isCaseSensitive = true;
      component.addKvp(kvpToAdd);
      expect(component.savedKvp[kvpToAdd.key]).toEqual(kvpToAdd.value);
    });

    it('Should return a kvp with the added a case-insensitive kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence().toUpperCase(),
        value: faker.lorem.sentence().toUpperCase(),
      };
      component.isCaseSensitive = false;
      component.addKvp(kvpToAdd);
      expect(component.savedKvp[kvpToAdd.key.toLowerCase()]).toEqual(kvpToAdd.value);
    });

    it('Should not add kvp to kvp if kvp is empty/null', () => {
      component.savedKvp = {} as Record<string, string>;
      const kvpToAdd: KeyValue<string, string> = {
        key: null,
        value: '',
      };

      component.addKvp(kvpToAdd);
      expect(component.savedKvp[kvpToAdd.key]).toBeFalsy();
    });
  });

  describe('KvpEditComponent.deleteKvp', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a kvp without the deleted kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence(),
      };

      component.addKvp(kvpToAdd);
      component.deleteKvp(kvpToAdd);
      expect(component.savedKvp[kvpToAdd.key]).toBeFalsy();
    });

    it('Should not be able to delete kvp if kvp if kvp is empty/null', () => {
      component.savedKvp = {} as Record<string, string>;
      const kvpToAdd: KeyValue<string, string> = {
        key: null,
        value: '',
      };

      component.addKvp(kvpToAdd);
      component.deleteKvp(kvpToAdd);
      expect(component.savedKvp[kvpToAdd.key]).toBeFalsy();
    });
  });

  describe('KvpEditComponent.kvp', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should set kvp to a kvp with the new kvp values', () => {
      const newKvpkvp = {} as Record<string, string>;
      newKvpkvp[faker.lorem.sentence()] = faker.lorem.sentence();
      component.kvp = newKvpkvp;
      expect(component.savedKvp).toEqual(newKvpkvp);
    });
  });

  describe('KvpEditComponent.Save', () => {
    it('Should emit the savedkvp kvp is Save is set to true', () => {
      const newKvpkvp = {} as Record<string, string>;
      newKvpkvp[faker.lorem.sentence()] = faker.lorem.sentence();
      jest.spyOn(component.savedKvpEmitter, 'emit');
      component.Save = true;

      expect(component.savedKvpEmitter.emit).toHaveBeenCalledWith(component.savedKvp);
    });

    it('Should not emit the savedkvp kvp is Save is set to false', (done) => {
      const newKvpkvp = {} as Record<string, string>;
      newKvpkvp[faker.lorem.sentence()] = faker.lorem.sentence();
      jest.spyOn(component.savedKvpEmitter, 'emit');
      component.Save = false;
      fixture.whenStable().then(() => {
        expect(component.savedKvpEmitter.emit).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
