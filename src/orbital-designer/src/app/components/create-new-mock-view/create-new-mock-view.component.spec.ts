import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { CreateNewMockViewComponent } from './create-new-mock-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';

describe('CreateNewMockViewComponent', () => {
  let component: CreateNewMockViewComponent;
  let fixture: ComponentFixture<CreateNewMockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewMockViewComponent],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [Location]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMockViewComponent);
    component = fixture.componentInstance;
    component.formGroup.addControl('testControl', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CreateNewMockViewComponent.errorMessages', () => {
    it('should output the correct error message', () => {
      const errors = {
        required: true,
        maxlength: true,
        custom: 'Custom error message'
      };
      component.formGroup.controls.testControl.setErrors(errors);
      const Expected = [
        'testControl is required',
        'Max characters exceeded',
        'Custom error message'
      ];
      expect(component.errorMessages('testControl')).toEqual(Expected);
    });

    it('should return an empty list if there are no errors', () => {
      expect(component.errorMessages('testControl')).toEqual([]);
    });
  });

  describe('CreateNewMockViewComponent.goBack', () => {
    it('should return to the previous location', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.goBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });
});
