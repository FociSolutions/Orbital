import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import {
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule
} from '@angular/material';
import { UrlListItemRuleTypeComponent } from './url-list-item-rule-type.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

fdescribe('UrlListItemRuleTypeComponent', () => {
  let component: UrlListItemRuleTypeComponent;
  let fixture: ComponentFixture<UrlListItemRuleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [UrlListItemRuleTypeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlListItemRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When form group is made', () => {
    it('should have a path from control', () => {
      expect(component.path).toBeTruthy();
    });

    it('should have a ruleType from control', () => {
      expect(component.ruleType).toBeTruthy();
    });
  });

  describe('When the ruleType is ACEEPTALL', () => {
    beforeEach(() => {
      component.ruleType.setValue(RuleType.ACCEPTALL);
    });

    it('should have the path be disabled', () => {
      expect(component.path.status).toBe('DISABLED');
    });
  });

  describe('When the ruleType is REGEX', () => {
    beforeEach(() => {
      component.ruleType.setValue(RuleType.REGEX);
    });

    describe('And path has not been set to a value', () => {
      it('should have path set to INVALID status', () => {
        expect(component.path.status).toBe('INVALID');
      });
    });

    describe('And path has been set to a value', () => {
      beforeEach(() => {
        component.path.setValue('cool/path');
      });
      it('should have path set to VALID status', () => {
        expect(component.path.status).toBe('VALID');
      });

      describe('And the remove button is pushed', () => {
        it('Should emitt the urlRuleRemovedEventEmitter', done => {
          component.urlRuleRemovedEventEmitter.subscribe(
            (url: KeyValuePairRule) => {
              expect(url.rule).toEqual({ urlPath: 'cool/path' });
              done();
            }
          );

          component.onRemove();
        });
      });
    });
  });
});
