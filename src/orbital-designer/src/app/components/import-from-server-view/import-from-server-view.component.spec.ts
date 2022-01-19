import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ImportFromServerViewComponent } from './import-from-server-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpResponse } from '@angular/common/http';
import { LoggerTestingModule } from 'ngx-logger/testing';
import * as faker from 'faker';
import { DesignerStore } from '../../store/designer-store';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';
import { BlankComponent } from 'src/app/shared/components/test/blank.component';

describe('ImportFromServerViewComponent', () => {
  let component: ImportFromServerViewComponent;
  let fixture: ComponentFixture<ImportFromServerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportFromServerViewComponent, BlankComponent],
      imports: [
        MatCardModule,
        RouterTestingModule.withRoutes([
          {
            path: 'endpoint-view',
            component: BlankComponent,
          },
        ]),
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
      ],
      providers: [Location, DesignerStore, OrbitalAdminService],
    }).compileComponents();
  });

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
      const locationSpy = jest.spyOn(TestBed.inject(Location), 'back');
      component.onBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('ImportFromServerViewComponent.onSubmit', () => {
    it('should set the designer stores Mockdefinitions and navigate to the endpoint-view', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
        const store = TestBed.inject(DesignerStore);
        const expectedMockDefinition: MockDefinition = validMockDefinition;
        const expectedMockDefinitions = {};
        expectedMockDefinitions[validMockDefinition.metadata.title] = expectedMockDefinition;
        component.mockDefinitions = [validMockDefinition];
        component.onSubmit();
        fixture.detectChanges();
        tick();
        expect(store.state.mockDefinitions).toEqual(expectedMockDefinitions);
        expect(routerSpy).toHaveBeenCalledWith('/endpoint-view');
      });
    }));
  });

  describe('ImportFromServerViewComponent.onListOutput', () => {
    it('should update the list of MockDefinitions using the values from the list of controls', () => {
      const expectedList = new Array(3).map(() => new FormControl(validMockDefinition));
      component.onListOutput(expectedList);
      expect(component.mockDefinitions).toEqual(expectedList.map((control) => control.value));
    });
  });

  describe('ImportFromServerViewComponent.disabled', () => {
    it('should return true if the Mockdefinitions list is empty', () => {
      expect(component.disabled).toBeTruthy();
    });

    it('should return false if the Mockdefinitions list is not empty', () => {
      component.mockDefinitions = [validMockDefinition];
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('ImportFromServerViewComponent.onResponse', () => {
    it('should set the control value to the response body given an http response with an array body', () => {
      const response = new HttpResponse({
        body: [{ body: faker.random.words(), openApi: { tags: [faker.random.words()] } }],
        status: 200,
      });
      component.onResponse(response.body as unknown as MockDefinition[]);
      expect(component.formArray.controls[0].value).toEqual(response.body[0]);
    });
  });
});
