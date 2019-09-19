import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestRequestInputComponent } from './rest-request-input.component';
import { OrbitalCommonModule } from '../orbital-common.module';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('RestRequestInputComponent', () => {
  let component: RestRequestInputComponent;
  let fixture: ComponentFixture<RestRequestInputComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();
    // tslint:disable-next-line: deprecation
    httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestRequestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('RestRequestInputComponent.sendRequest', () => {
    it('should send request to localhost', () => {
      component.inputControl.setValue('localhost:4200');
      component.sendRequest();
      const mockReq = httpMock.expectOne(
        `http://${component.inputControl.value}`
      );
      expect(mockReq.cancelled).toBeFalsy();
      mockReq.flush('');
    });
  });
});
