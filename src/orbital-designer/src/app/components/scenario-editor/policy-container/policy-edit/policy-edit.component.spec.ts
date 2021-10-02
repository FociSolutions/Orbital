import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PolicyEditComponent } from './policy-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';

describe('PolicyEditComponent', () => {
  let component: PolicyEditComponent;
  let fixture: ComponentFixture<PolicyEditComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [PolicyEditComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyEditComponent);
    component = fixture.componentInstance;
    component.policyEditFormGroup = new FormGroup({
      delay: new FormControl('', [Validators.required, Validators.min(1)]),
      policyType: new FormControl(PolicyType.NONE, [Validators.required])
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When form group is made', () => {
    it('should have a delay from control', () => {
      expect(component.delay).toBeTruthy();
    });

    it('should have a policyType from control', () => {
      expect(component.policyType).toBeTruthy();
    });
  });

  describe('When the policyType is DELAYRESPONSE', () => {
    beforeEach(() => {
      component.policyType.setValue(PolicyType.DELAYRESPONSE);
    });

    describe('And delay has been set to a valid value', () => {
      beforeEach(() => {
        component.delay.setValue(2);
      });
      it('should have delay set to VALID status', () => {
        expect(component.delay.status).toBe('VALID');
      });

      describe('And the remove button is pushed', () => {
        it('Should emit the policyRemovedEventEmitter', done => {
          component.policyRemovedEventEmitter.subscribe((policy: Policy) => {
            expect(policy.attributes).toEqual({ delay: '2' });
            done();
          });

          component.onRemove();
        });
      });
    });
  });
});
