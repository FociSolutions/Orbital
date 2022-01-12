import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemComponent } from './kvp-list-item.component';
import { KeyValue } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

describe('KvpListItemComponent', () => {
  let component: KvpListItemComponent;
  let fixture: ComponentFixture<KvpListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
    }).compileComponents();

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
        value: faker.lorem.sentence(),
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });
  });

  describe('onRemove', () => {
    it('Should emit a remove event', (done) => {
      const input: KeyValue<string, string> = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence(),
      };

      component.kvp = input;

      component.removeKvp.subscribe((actual) => {
        expect(actual).toEqual(input);
        done();
      });

      component.onRemove();
    });
  });
});
