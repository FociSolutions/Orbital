import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UrlListItemRuleTypeComponent } from './url-list-item-rule-type.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UrlRule } from 'src/app/models/mock-definition/scenario/url-rule.model';
import { UrlEditRuleComponent } from '../url-edit-rule.component';

describe('UrlListItemRuleTypeComponent', () => {
  let component: UrlListItemRuleTypeComponent;
  let fixture: ComponentFixture<UrlListItemRuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      declarations: [UrlListItemRuleTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlListItemRuleTypeComponent);
    component = fixture.componentInstance;
    component.urlEditRuleFormGroup = new FormGroup({
      path: new FormControl('', [Validators.required, Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH)]),
      type: new FormControl(RuleType.NONE, [Validators.required]),
    });
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

    describe('And path has been set to a value', () => {
      beforeEach(() => {
        component.path.setValue('cool/path');
      });
      it('should have path set to VALID status', () => {
        expect(component.path.status).toBe('VALID');
      });

      describe('And the remove button is pushed', () => {
        it('Should emit the urlRuleRemovedEventEmitter', (done) => {
          component.urlRuleRemovedEventEmitter.subscribe((url: UrlRule) => {
            expect(url.path).toEqual('cool/path');
            done();
          });

          component.onRemove();
        });
      });
    });
  });
});
