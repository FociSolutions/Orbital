import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddComponent } from './kvp-add.component';

describe('KvpAddComponent', () => {
  let component: KvpAddComponent;
  let fixture: ComponentFixture<KvpAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KvpAddComponent]
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

  describe('KvpAddComponent.hadDuplicates', () => {
    component.kvpMap.set('text', 'text');

    it('should return true if there are duplicate keys', () => {});
  });
});
