import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpEditComponent } from './kvp-edit.component';
import { OrbitalCommonModule } from '../orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValue } from '@angular/common';

describe('KvpEditComponent', () => {
  let component: KvpEditComponent;
  let fixture: ComponentFixture<KvpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        LoggerTestingModule,
        BrowserAnimationsModule
      ]
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

  describe('KvpEditComponent.addKvpToMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return a map with the added kvp', () => {
      const kvpToAdd: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };

      component.addKvpToMap(kvpToAdd);
      expect(component.savedKvpMap.get(kvpToAdd.key)).toEqual(kvpToAdd.value);
    });
  });
});
