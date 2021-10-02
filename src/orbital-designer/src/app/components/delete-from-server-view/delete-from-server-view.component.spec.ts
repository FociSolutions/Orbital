import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteFromServerViewComponent } from './delete-from-server-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpResponse } from '@angular/common/http';
import { LoggerTestingModule } from 'ngx-logger/testing';
import * as faker from 'faker';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { FormControl } from '@angular/forms';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('DeleteFromServerViewComponent', () => {
  let component: DeleteFromServerViewComponent;
  let fixture: ComponentFixture<DeleteFromServerViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteFromServerViewComponent],
      imports: [
        MatCardModule,
        RouterTestingModule,
        OrbitalCommonModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatSnackBarModule
      ],
      providers: [Location, OrbitalAdminService, NotificationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFromServerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DeleteFromServerViewComponent.onBack', () => {
    it('should call location.back()', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.onBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('DeleteFromServerViewComponent.onListOutput', () => {
    it('should update the list of MockDefinitions using the values from the list of controls', () => {
      const expectedList = new Array(3).map(() => new FormControl(validMockDefinition));
      component.onListOutput(expectedList);
      expect(component.mockDefinitions).toEqual(expectedList.map(control => control.value));
    });
  });

  describe('DeleteFromServerViewComponent.disabled', () => {
    it('should return true if the Mockdefinitions list is empty', () => {
      expect(component.disabled).toBeTruthy();
    });

    it('should return false if the Mockdefinitions list is not empty', () => {
      component.mockDefinitions = [validMockDefinition];
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('DeleteFromServerViewComponent.onResponse', () => {
    it('should set the control value to the response body given an http response with an array body', () => {
      const response = new HttpResponse({
        body: [{ body: faker.random.words(), openApi: { tags: [faker.random.words()] } }],
        status: 200
      });
      component.onResponse((response.body as unknown) as MockDefinition[]);
      expect(component.formArray.controls[0].value).toEqual(response.body[0]);
    });
  });
});
