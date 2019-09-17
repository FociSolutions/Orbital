import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ImportFromServerViewComponent } from './import-from-server-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import mockDefinitionObject from '../../../test-files/test-mockdefinition-object';
import { HttpResponse } from '@angular/common/http';
import * as faker from 'faker';

describe('ImportFromServerViewComponent', () => {
  let component: ImportFromServerViewComponent;
  let fixture: ComponentFixture<ImportFromServerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFromServerViewComponent],
      imports: [
        MatCardModule,
        RouterTestingModule,
        OrbitalCommonModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [Location]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromServerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ImportFromServerViewComponent.onBack', () => {
    it('should call location.back()', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.onBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('ImportFromServerViewComponent.disabled', () => {
    it('should return true if the control is invalid', () => {
      expect(component.disabled).toBeTruthy();
    });

    it('should return false if the control is valid', () => {
      component.control.setValue([mockDefinitionObject]);
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('ImportFromServerViewComponent.onResponse', () => {
    it('should set the control value to the response body given an OK response', done => {
      const response = new HttpResponse({
        body: faker.random.words(),
        status: 200
      });
      component.control.valueChanges.subscribe(value => {
        expect(value).toEqual(response.body);
        done();
      });
      component.onResponse(response);
    });

    it('should not set the control value when given a response whose status is not OK', () => {
      const response = new HttpResponse({
        body: faker.random.words(),
        status: 400
      });
      component.onResponse(response);
      expect(component.control.value).not.toEqual(response.body);
    });
  });
});
