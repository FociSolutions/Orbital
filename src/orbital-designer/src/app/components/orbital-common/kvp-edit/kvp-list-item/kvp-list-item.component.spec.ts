import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemComponent } from './kvp-list-item.component';
import { OrbitalCommonModule } from '../../orbital-common.module';

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
    component.kvp = { key: '', value: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpListItemComponent.getKvpKey', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('Should return empty key is kvp is null', () => {
      component.kvp = null;
      expect(component.kvpKey).toEqual('');
    });

    it('Should return empty key is kvp is undefined', () => {
      component.kvp = undefined;
      expect(component.kvpKey).toEqual('');
    });

    it('Should return key if kvp is not null or undefined', () => {
      const randomKey: string = faker.lorem.sentence();
      const randomValue: string = faker.lorem.sentence();
      component.kvp = {
        key: randomKey,
        value: randomValue
      };
      expect(component.kvpKey).toEqual(randomKey);
    });
  });

  describe('KvpListItemComponent.getKvpValue', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should return empty value is kvp is null', () => {
      component.kvp = null;
      expect(component.kvpValue).toEqual('');
    });

    it('Should return empty value is kvp is null', () => {
      component.kvp = undefined;
      expect(component.kvpValue).toEqual('');
    });
    it('Should return value if kvp is not null or undefined', () => {
      const randomKey: string = faker.lorem.sentence();
      const randomValue: string = faker.lorem.sentence();
      component.kvp = {
        key: randomKey,
        value: randomValue
      };
      expect(component.kvpValue).toEqual(randomValue);
    });
  });

  describe('KvpListItemComponent.onRemove()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('Should emit a remove event', () => {
      const randomKey: string = faker.lorem.sentence();
      const randomValue: string = faker.lorem.sentence();
      component.kvp = {
        key: randomKey,
        value: randomValue
      };
      fixture.detectChanges();
      spyOn(component.removeKvp, 'emit');
      component.onRemove();
      expect(component.removeKvp.emit).toHaveBeenCalledWith({
        key: randomKey,
        value: randomValue
      });
    });
  });
});
