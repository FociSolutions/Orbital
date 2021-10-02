import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { UrlAddRuleComponent } from './url-add-rule.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';

describe('UrlAddRuleComponent', () => {
  let component: UrlAddRuleComponent;
  let fixture: ComponentFixture<UrlAddRuleComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UrlAddRuleComponent],
      imports: [
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UrlAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

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

      describe('And the add button is pushed', () => {
        it('Should emitt the urlRuleAddedEventEmitter', done => {
          component.urlRuleAddedEventEmitter.subscribe(
            (url: KeyValuePairRule) => {
              expect(url.rule).toEqual({ urlPath: 'cool/path' });
              done();
            }
          );

          component.addUrlRule();
        });
      });
    });
  });
});
