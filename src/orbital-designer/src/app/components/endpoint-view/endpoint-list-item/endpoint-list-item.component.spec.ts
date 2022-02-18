import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EndpointListItemComponent } from './endpoint-list-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { GetVerbStringPipe } from 'src/app/pipes/get-verb-string/get-verb-string.pipe';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/models/endpoint.model';
import * as faker from 'faker';
import { VerbType } from 'src/app/models/verb-type';
import { OpenAPIV2 } from 'openapi-types';
import { MatIconModule } from '@angular/material/icon';

describe('EndpointListItemComponent', () => {
  let component: EndpointListItemComponent;
  let fixture: ComponentFixture<EndpointListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointListItemComponent, GetVerbColorPipe, GetVerbStringPipe],
      imports: [MatCardModule, MatIconModule, RouterTestingModule, LoggerTestingModule],
      providers: [DesignerStore],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('EndpointListItemComponent.selectEndpoint()', () => {
    beforeEach(() => {
      const path = `/${faker.random.words()}`;
      const verb = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);

      const response = { description: faker.random.words() } as OpenAPIV2.Response;
      const responseObject = { default: response } as OpenAPIV2.ResponsesObject;

      component.endpoint = {
        path,
        verb,
        spec: {
          responses: responseObject,
        } as OpenAPIV2.OperationObject,
      } as Endpoint;
      fixture.detectChanges();
    });

    it('Should select endpoint and navigate to scenario view page', fakeAsync(() => {
      fixture.ngZone.run(() => {
        jest.spyOn(TestBed.inject(Router), 'navigateByUrl').mockImplementation((route) => {
          expect(route).toEqual('/scenario-view');
          return Promise.resolve(false);
        });
        component.selectEndpoint();
        tick();
      });
    }));
  });
});
