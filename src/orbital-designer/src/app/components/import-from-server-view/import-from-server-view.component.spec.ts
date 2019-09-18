import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ImportFromServerViewComponent } from './import-from-server-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LoggerTestingModule } from 'ngx-logger/testing';
import * as faker from 'faker';
import { FormControl } from '@angular/forms';

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
        BrowserAnimationsModule,
        LoggerTestingModule
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
    it('should return true if the formArray is empty', () => {
      expect(component.disabled).toBeTruthy();
    });

    it('should return false if the formArray is notEmpty', () => {
      component.formArray.push(new FormControl(''));
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('ImportFromServerViewComponent.onResponse', () => {
    it('should set the control value to the response body given an http response with an array body', () => {
      const response = new HttpResponse({
        body: [faker.random.words()],
        status: 200
      });
      component.onResponse(response);
      expect(component.formArray.controls[0].value).toEqual(response.body[0]);
    });

    it('should not set the control value when given a response is an HttpErrorResponse', () => {
      const response = new HttpErrorResponse({});
      component.onResponse(response);
      expect(component.formArray.length).toBe(0);
    });

    it('should not set the control value when given a response is an DomException', () => {
      const response = new DOMException();
      component.onResponse(response);
      expect(component.formArray.length).toBe(0);
    });

    it('should not set the control value when given a response whose body is not an array', () => {
      const response = new HttpResponse({
        body: faker.random.words(),
        status: 200
      });
      component.onResponse(response);
      expect(component.formArray.length).toBe(0);
    });
  });
});
