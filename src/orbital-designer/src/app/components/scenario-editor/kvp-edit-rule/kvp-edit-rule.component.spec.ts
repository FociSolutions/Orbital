import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpEditRuleComponent } from './kvp-edit-rule.component';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValue } from '@angular/common';
import { KvpListItemRuleComponent } from './kvp-list-item-rule/kvp-list-item-rule.component';
import { KvpAddRuleComponent } from './kvp-add-rule/kvp-add-rule.component';
import { MatCardModule } from '@angular/material';

describe('KvpEditRuleComponent', () => {
  let component: KvpEditRuleComponent;
  let fixture: ComponentFixture<KvpEditRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        LoggerTestingModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [
        KvpListItemRuleComponent,
        KvpAddRuleComponent,
        KvpEditRuleComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpEditRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpEditRuleComponent.addKvpToMap', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
  });
});
