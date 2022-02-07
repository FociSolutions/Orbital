import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { UrlAddRuleComponent } from './url-add-rule.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { UrlRule } from 'src/app/models/mock-definition/scenario/url-rule.model';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';

describe('UrlAddRuleComponent', () => {
  let component: UrlAddRuleComponent;
  let fixture: ComponentFixture<UrlAddRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlAddRuleComponent, GetRuleTypeStringPipe],
      imports: [
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlAddRuleComponent);
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

    it('should have a type from control', () => {
      expect(component.type).toBeTruthy();
    });
  });

  describe('When the RuleType is ACCEPTALL', () => {
    beforeEach(() => {
      component.type.setValue(RuleType.ACCEPTALL);
    });

    it('should have the path be disabled', () => {
      expect(component.path.status).toBe('DISABLED');
    });
  });

  describe('When the RuleType is REGEX', () => {
    beforeEach(() => {
      component.type.setValue(RuleType.REGEX);
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
        it('Should emit the urlRuleAddedEventEmitter', (done) => {
          component.urlRuleAddedEventEmitter.subscribe((url: UrlRule) => {
            expect(url.path).toEqual('cool/path');
            done();
          });

          component.addUrlRule();
        });
      });
    });
  });
});
