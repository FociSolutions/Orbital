import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyAddComponent } from './policy-add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatIconModule, MatSelectModule, MatCardModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';

describe('PolicyAddComponent', () => {
  let component: PolicyAddComponent;
  let fixture: ComponentFixture<PolicyAddComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [PolicyAddComponent],
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When form group is made', () => {
    it('should have a attributes from control', () => {
      expect(component.attributes).toBeTruthy();
    });

    it('should have a policyType from control', () => {
      expect(component.policyType).toBeTruthy();
    });
  });

  describe('When the policyType is set to Delay Response', () => {
    beforeEach(() => {
      component.policyType.setValue(PolicyType.DELAYRESPONSE);
    });

    describe('And delay has not been set to a value', () => {
      it('should have delay set to INVALID status', () => {
        expect(component.delay.status).toBe('INVALID');
      });
    });

    describe('And delay is set to 0', () => {
      it('should have delay set to INVALID status', () => {
        component.delay.setValue(0);
        expect(component.delay.status).toBe('INVALID');
      });
    });

    describe('And delay has been set to a value', () => {
      beforeEach(() => {
        component.attributes
          .at(0)
          .get('delay')
          .setValue('2');
      });
      it('should have delay set to VALID status', () => {
        expect(component.delay.status).toBe('VALID');
      });

      describe('And the add button is pushed', () => {
        it('Should emit the policyAddedEventEmitter', done => {
          component.policyAddedEventEmitter.subscribe((policy: Policy) => {
            expect(policy.attributes).toEqual({ delay: '2' });
            done();
          });

          component.addPolicy();
        });
      });
    });
  });
});
