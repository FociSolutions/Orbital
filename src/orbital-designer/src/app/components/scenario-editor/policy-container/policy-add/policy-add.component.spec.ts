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

  beforeEach(async(() => {
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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

    describe('And delayTime has not been set to a value', () => {
      it('should have delayTime set to INVALID status', () => {
        expect(component.delayTime.status).toBe('INVALID');
      });
    });

    describe('And delayTime is set to 0', () => {
      it('should have delayTime set to INVALID status', () => {
        component.delayTime.setValue(0);
        expect(component.delayTime.status).toBe('INVALID');
      });
    });

    describe('And delayTime has been set to a value', () => {
      beforeEach(() => {
        component.attributes
          .at(0)
          .get('delayTime')
          .setValue('2');
      });
      it('should have delayTime set to VALID status', () => {
        expect(component.delayTime.status).toBe('VALID');
      });

      describe('And the add button is pushed', () => {
        it('Should emit the policyAddedEventEmitter', done => {
          component.policyAddedEventEmitter.subscribe((policy: Policy) => {
            expect(policy.attributes).toEqual({ delayTime: '2' });
            done();
          });

          component.addPolicy();
        });
      });
    });
  });
});
